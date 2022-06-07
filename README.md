## 平台简介

孔明先生后台管理系统是一套全部开源的快速开发平台，毫无保留给个人及企业免费使用。

- 前端采用 Vue2.x、Element UI。
- 后端采用 Node.js、Koa2 等实现接口封装。
- 权限认证使用 Jwt，支持多终端认证系统。
- 支持加载动态权限菜单，多方式轻松权限控制。
- 高效率开发，使用代码生成器可以一键生成前后端代码。
- 特别鸣谢：[element](https://github.com/ElemeFE/element)，[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)，[eladmin-web](https://github.com/elunez/eladmin-web)。



## 内置功能

1. ###### 访问中心

   - 首页：项目的简单介绍；
   - 概览：短信发送平台的充值账户数据，以及发送记录、充值记录统计；
   - 个人中心：支持修改密码、换绑邮箱、修改昵称、绑定手机号、实名认证、更换头像等操作。

2. ###### 短信管理

   - 发送短信：支持批量导入号码，直接发送短信、定时发送短信；
   - 短信模板：对短信模板进行维护；
   - 发送记录：查看发送记录，含失败重发等功能；
   - 发送回执：查看每条短信的发送状态。

3. ###### 财务管理

   - 立即充值：支持通过支付宝直接充值短信余额；
   - 充值订单：展示每条充值数据，以及充值订单。

4. ###### 信息管理

   - 通知公告：支持发布通知、公告、版本日志等类型的文章。

5. ###### 日志管理

   - 登录日志：系统登录日志记录查询包含登录异常；
   - 操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。

6. ###### 系统管理

   - 用户管理：用户是系统操作者，该功能主要完成系统用户配置；
   - 角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分；
   - 菜单管理：配置系统菜单，操作权限，按钮权限标识等；
   - 字典管理：对系统中经常使用的一些较为固定的数据进行维护；
   - 部门管理：以树型方式管理系统部门数据；
   - 岗位管理：基础岗位数据管理；
   - 参数配置：初始化配置系统的基础属性；
   - 在线用户：查看当前在线用户列表、强制将某个用户踢下线。

7. ###### 登录管理

   - 白名单配置：配置登录白名单；
   - 黑名单配置：配置登录黑名单；
   - 访问时间段：配置不可访问的时间段；
   - 常用设备：配置新设备登录相关参数；如是否允许新设备登录，新设备登录开启通知，新设备登录开启二次验证，允许多设备同时在线，新设备认证时间等；
   - 密码策略：配置密码生成以及使用过程中的相关策略；如密码格式、强制修改密码的时效性等。

8.  ###### 登录模块

    - 登录：支持账号+密码登录、邮箱+验证码登录、手机号+验证码登录；
    - 注册：支持选定角色注册、密码策略校验；
    - 忘记密码：通过邮箱找回密码。

9. ###### 组件管理

   - 图表库
   - 图标库
   - 富文本
   - Markdown
   - Yaml编辑器



## 涉及的开发对接说明

###### 1.发送邮箱验证码（对接QQ邮箱配置）

- 配置文档详细地址： http://kmxs.com.cn/articles/web/2022-01-20/160.html

###### 2.百度智能云平台 - API接口对接（识别身份证信息）

- 配置文档详细地址：https://cloud.baidu.com/doc/OCR/s/rk3h7xzck

###### 3.短信发送平台API接口对接（用于发送短息）

- 配置文档详细地址：https://www.yuntongxun.com/member/main



## 在线体验

- admin / 123456
- 陆陆续续收到一些打赏，为了更好的体验已用于演示服务器升级。谢谢各位小伙伴。
- 
- 除演示账号不可操作外，其他新注册的账号，可根据账号所有权限进行相应操作
- 
- <u>如需操作【短信发送平台】相关操作，可注册新账号，加下方群号，联系管理员绑定相应权限即可。</u>

演示地址：[http://gitee.kmxs.com.cn](http://gitee.kmxs.com.cn/)

项目运行详细安装操作地址：https://kdocs.cn/l/ctJcgulzqKUa



## 演示图

<table>
    <tr>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-021.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-022.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-023.jpg"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-024.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-025.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-026.jpg"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-027.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-028.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-029.jpg"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-001.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-002.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-003.jpg"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-004.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-005.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-006.jpg"/></td>
    </tr>
	<tr>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-007.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-008.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-009.jpg"/></td>
    </tr>
	<tr>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-010.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-011.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-012.jpg"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-013.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-014.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-015.jpg"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-016.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-017.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-018.jpg"/></td>
    </tr>
    <tr>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-019.jpg"/></td>
        <td><img src="https://github.com/MrSong1024/kmxs-images/blob/main/kmxs-020.jpg"/></td>
    </tr>
</table>


## 更新日志

###### v1.0.0 - 2022-1-20

> 孔明前后端分离系统正式发布

1. 登录模块（支持账号/邮箱登录，注册，重置密码）
2. 商品管理模块（支持新增，编辑，删除，导出）
3. 用户管理模块（支持新增，编辑，删除，重置密码，启用/禁用）
4. 字典管理模块（支持新增，编辑，（批量）删除，启用/禁用）
5. 角色管理模块（支持新增，编辑，（批量）删除，启用/禁用，绑定权限）
6. 菜单管理模块（支持新增，编辑，（批量）删除）
7. 操作日志记录（支持（批量）删除，查看详细）
8. 登录日志记录（支持（批量）删除）
9. 支持发送邮箱验证码，绑定邮箱的操作
10. 支持用户修改密码、修改昵称、换绑邮箱等操作



###### v1.1.0 - 2022-1-25

1. 新增图表库组件，引入 Echart；
2. 新增图标库组件；
3. 新增富文本组件，基于 [wangEditor](https://www.kancloud.cn/wangfupeng/wangeditor3/332599)，图片上传使用 [SM.MS](https://sm.ms/)；
4. 新增 Markdown 组件，基于 [MavonEditor](https://github.com/hinesboy/mavonEditor) ，图片上传使用 [SM.MS](https://sm.ms/)；
5. 新增 Yaml 编辑器，基于 [CodeMirror](https://github.com/codemirror/CodeMirror)， 主题预览地址 [Theme](https://codemirror.net/demo/theme.html#idea)；
6. 新增（信息管理）通知公告模块，支持通知、公告、版本日志等类型文档的发布分类及编辑、删除。



###### v1.2.0 - 2022-2-11

1. 新增概览首页；
2. 新增个人中心模块（修改密码、换绑邮箱、换绑手机号、更换头像、安实名认证）等操作；



###### v1.2.1 - 2022-2-12

1. 概览首页顶部新增滚动公告消息展示；



###### v1.3.0 - 2022-4-5

> SMS短信发送平台搭建

1. 发送短信（支持批量导入手机号、定时发送）
2. 短信模板（含新增、编辑、批量删除、绑定模板ID）
3. 发送记录（含重新发送、批量删除）
4. 发送回执（含批量删除）
5. 定时短信（含一键发送、批量删除）
6. 首页概览（查看用户短信余额及使用情况）
7. 财务管理 - 充值订单（目前仅支持人工核实充值信息）



> 其他后台优化

1. 增加在线客服系统，可直接通过网页聊天界面联系站长
2. 代码优化（列表代码封装成一个组件，使代码更简洁）
3. 提交短信对接平台接口文档



###### v1.3.2 - 2022-4-11

1. 增加支付宝沙盒支付工具对接，模拟支付宝支付；
2. 修复部分bug。



###### v1.4.0 - 2022-4-23

1. 完成部门管理模块开发（含新增、编辑、删除）；
2. 完成岗位管理模块开发（含新增、编辑、删除）；
3. 重构前端样式表。



###### v1.5.0 - 2022-5-6

1. 完成登录白名单开发（含新增、编辑、删除、启用、禁用）；
2. 完成登录黑名单模块开发及配置（含新增、编辑、删除、启用、禁用）；
3. 完成登录访问时间段模块开发及配置（含新增、编辑、删除、启用、禁用）；
4. 完成登录异地登录【常用设备】模块开发及配置（含新增、编辑、删除、启用、禁用）；
5. 支持手机+验证码登录后台系统；
6. 支持邮箱+验证码登录后台系统；
7. 重构换绑邮箱、换绑手机号组件；
8. bug修复。



###### v1.5.4 - 2022-5-16

1. 完善登录管理相关细节逻辑（含：白名单、黑名单、常用设备）等的操作逻辑确认；
2. 新增登录管理 - 密码策略模块；
   - 注册账号校验密码策略；
   - 修改密码校验密码策略； 
   - 登录账号，临近密码最长使用期限7天，发送邮件提醒用户修改密码； 
3. 查看当前在线用户，强制下线用户；
4. 更新初始化数据集合；
5. bug修复。



###### v1.5.5 - 2022-5-26

1. 新增拓展属性模块，目前仅匹配了用户管理的自定义属性；
2. 更新初始化数据集合；
3. bug修复。



###### 其他待开发功能（不完全统计）

1. 对接支付（支付宝、微信等）功能；（已完成支付宝沙盒支付对接）
2. 消息审批；
8. 通过可视化界面控制界面主题；
4. 国际化。



## 孔明先生前后端分离交流群

<u>如需操作【短信发送平台】相关操作，可注册新账号，加下方群号，联系管理员绑定相应权限即可。</u>

QQ 群：[![加入QQ群](https://img.shields.io/badge/305564464-blue.svg)](https://jq.qq.com/?_wv=1027&k=ciQISIJ7) 点击按钮入群。