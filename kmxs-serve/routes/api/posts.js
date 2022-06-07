const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const validatePostInput = require("../../validation/post");

/**
 * @route POST api/posts
 * @desc  创建留言接口地址
 * @access 接口是私有的
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (ctx) => {
    const { errors, isValid } = validatePostInput(ctx.request.body);
    // 判断是否验证通过
    if (!isValid) {
      ctx.status = 400;
      ctx.body = errors;
      return;
    }
    const newPost = new Post({
      text: ctx.request.body.text,
      name: ctx.request.body.name,
      avatar: ctx.request.body.avatar,
      user: ctx.state.user.id,
    });

    await newPost
      .save()
      .then((post) => (ctx.body = post))
      .catch((err) => (ctx.body = err));
    ctx.body = newPost;
  }
);

/**
 * @route POST api/posts/all
 * @desc  所有留言接口地址
 * @access 接口是公开的
 */
router.get("/all", async (ctx) => {
  await Post.find()
    .sort({ date: -1 })
    .then((posts) => {
      ctx.status = 200;
      ctx.body = posts;
    })
    .catch((err) => {
      ctx.status = 404;
      ctx.body = { nopostsfound: "找不到任何留言信息" };
    });
});

/**
 * @route POST api/posts?id=asdfasdf
 * @desc  单个留言接口地址
 * @access 接口是公开的
 */
router.get("/", async (ctx) => {
  const id = ctx.query.id;
  await Post.findById(id)
    .then((post) => {
      ctx.status = 200;
      ctx.body = post;
    })
    .catch((err) => {
      ctx.status = 404;
      ctx.body = { nopostfound: "没有留言信息" };
    });
});

/**
 * @route DELETE api/posts?id=adsfasdfasf
 * @desc  删除单个留言接口地址
 * @access 接口是私有的
 */
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (ctx) => {
    const id = ctx.query.id;
    // 当前用户是否拥有个人信息
    const profile = await Profile.find({ user: ctx.state.user.id });
    if (profile.length > 0) {
      // 查找此人的留言
      const post = await Post.findById(id);

      // 判断是不是当前用户操作
      if (post.user.toString() !== ctx.state.user.id) {
        ctx.status = 401;
        ctx.body = { notauthorized: "用户非法操作" };
        return;
      }

      await Post.deleteOne({ _id: id }).then(() => {
        ctx.status = 200;
        ctx.body = { success: true };
      });
    } else {
      ctx.status = 404;
      ctx.body = { error: "个人信息不存在" };
    }
  }
);

/**
 * @route POST api/posts/like?id=afdsfadfasf
 * @desc  点赞接口地址
 * @access 接口是私有的
 */
router.post(
  "/like",
  passport.authenticate("jwt", { session: false }),
  async (ctx) => {
    const id = ctx.query.id;

    // 查询用户信息
    const profile = await Profile.find({ user: ctx.state.user.id });
    if (profile.length > 0) {
      const post = await Post.findById(id);
      const isLike =
        post.likes.filter((like) => like.user.toString() === ctx.state.user.id)
          .length > 0;
      if (isLike) {
        ctx.status = 400;
        ctx.body = { alreadyliked: "该用户已赞过" };
        return;
      }

      post.likes.unshift({ user: ctx.state.user.id });

      const postUpdate = await Post.updateOne(
        { _id: id },
        { $set: post },
        { new: true }
      );
      ctx.body = postUpdate;
    } else {
      ctx.status = 404;
      ctx.body = { error: "profile 不存在" };
    }
  }
);

/**
 * @route POST api/posts/unlike?id=afdsfadfasf
 * @desc  取消点赞接口地址
 * @access 接口是私有的
 */
router.post(
  "/unlike",
  passport.authenticate("jwt", { session: false }),
  async (ctx) => {
    const id = ctx.query.id;

    // 查询用户信息
    const profile = await Profile.find({ user: ctx.state.user.id });
    if (profile.length > 0) {
      const post = await Post.findById(id);
      const isLike =
        post.likes.filter((like) => like.user.toString() === ctx.state.user.id)
          .length === 0;
      if (isLike) {
        ctx.status = 400;
        ctx.body = { alreadyliked: "该用户没有点赞过" };
        return;
      }

      // 获取要删掉的user id
      const removeIndex = post.likes
        .map((item) => item.user.toString())
        .indexOf(id);

      post.likes.splice(removeIndex, 1);

      const postUpdate = await Post.updateOne(
        { _id: id },
        { $set: post },
        { new: true }
      );
      ctx.body = postUpdate;
    } else {
      ctx.status = 404;
      ctx.body = { error: "profile 不存在" };
    }
  }
);

/**
 * @route POST api/posts/comment?id=afdsfadfasf
 * @desc  评论接口地址
 * @access 接口是私有的
 */
router.post(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  async (ctx) => {
    const id = ctx.query.id;
    const post = await Post.findById(id);
    const newComment = {
      text: ctx.request.body.text,
      name: ctx.request.body.name,
      avatar: ctx.request.body.avatar,
      user: ctx.state.user.id,
    };

    post.comments.unshift(newComment);
    const postUpdate = await Post.updateOne(
      { _id: id },
      { $set: post },
      { new: true }
    );
    ctx.body = postUpdate;
  }
);

/**
 * @route DELETE api/posts/comment?id=afdsfadfasf&comment_id=dsfasdfasfd
 * @desc  删除评论接口地址
 * @access 接口是私有的
 */
router.delete(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  async (ctx) => {
    const id = ctx.query.id;
    const comment_id = ctx.query.comment_id;

    const post = await Post.findById(id);
    const isComment =
      post.comments.filter((comment) => comment._id.toString() === comment_id)
        .length == 0;
    if (isComment) {
      ctx.status = 400;
      ctx.body = { commentnotexists: "该评论不存在" };
      return;
    }

    // 找到该评论信息
    const removeIndex = post.comments
      .map((item) => item._id.toString())
      .indexOf(comment_id);
    // 删除
    post.comments.splice(removeIndex, 1);
    const postUpdate = await Post.findByIdAndUpdate(
      { _id: id },
      { $set: post },
      { new: true }
    );
    ctx.body = postUpdate;
  }
);

module.exports = router.routes();
