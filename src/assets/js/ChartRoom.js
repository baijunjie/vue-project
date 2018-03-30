import BaseEventObject from 'base-event-object';
import { utils, api } from 'G';

const RongIMLib = window.RongIMLib;
const RongIMClient = window.RongIMClient;

export default class {
    constructor(chatRoomId) {
        this.chatRoomId = chatRoomId;
        this._emiter = new BaseEventObject({
            events: [
                'receive'
            ],
            onceEvents: [
                'ready'
            ]
        });
        this._init();
    }

    _init() {
        RongIMLib.RongIMClient.init('25wehl3u29kow'); // App Key

        // 设置监听
        // 设置连接监听状态 （ status 标识当前连接状态 ）
        // 连接状态监听器
        RongIMClient.setConnectionStatusListener({
            onChanged: status => {
                switch (status) {
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功');
                        this._emiter.emit('ready');
                        break;
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        break;
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        console.log('其他设备登录');
                        break;
                    case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                        console.log('域名不正确');
                        break;
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用');
                        break;
                }
            }});

        // 消息监听器
        RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: message => {
                this._emiter.emit('receive', {
                    user: message.senderUserId,
                    message: message.content.content
                });
                // 判断消息类型
                switch(message.messageType){
                    case RongIMClient.MessageType.TextMessage:
                        // message.content.content => 消息内容
                        break;
                    case RongIMClient.MessageType.VoiceMessage:
                        // 对声音进行预加载
                        // message.content.content 格式为 AMR 格式的 base64 码
                        break;
                    case RongIMClient.MessageType.ImageMessage:
                        // message.content.content => 图片缩略图 base64。
                        // message.content.imageUri => 原图 URL。
                        break;
                    case RongIMClient.MessageType.DiscussionNotificationMessage:
                        // message.content.extension => 讨论组中的人员。
                        break;
                    case RongIMClient.MessageType.LocationMessage:
                        // message.content.latiude => 纬度。
                        // message.content.longitude => 经度。
                        // message.content.content => 位置图片 base64。
                        break;
                    case RongIMClient.MessageType.RichContentMessage:
                        // message.content.content => 文本消息内容。
                        // message.content.imageUri => 图片 base64。
                        // message.content.url => 原图 URL。
                        break;
                    case RongIMClient.MessageType.InformationNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ContactNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ProfileNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.UnknownMessage:
                        // do something...
                        break;
                    default:
                    // do something...
                }
            }
        });

        this._getToken().then(token => {
            console.log('token: ', token);
            this._connect(token);
        });
    }

    _getToken(token) {
        return utils.ajax({
            method: 'get',
            url: api.getToken,
            data: {
                token: token
            }
        }).then(res => {
            console.log('获取Token', res);
            if (res.code == 200) {
                return res.data.imtoken;
            } else if (res.code == 40006) {
                let result = res.msg.match(/servertoken is (.+)/);
                if (result && result[1]) {
                    return this._getToken(result[1]);
                }
            }
        });
    }

    _connect(token) {
        RongIMClient.connect(token, {
            onSuccess: userId => {
                console.log("Connect successfully." + userId);
            },
            onTokenIncorrect: () => {
                console.log('token无效');
            },
            onError: errorCode => {
                let info = '';
                switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                        info = '未知错误';
                        break;
                    case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                        info = '不可接受的协议版本';
                        break;
                    case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                        info = 'appkey不正确';
                        break;
                    case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                        info = '服务器不可用';
                        break;
                }
                console.log(errorCode);

                this._reconnect();
            }
        });
    }

    _reconnect() {
        let callback = {
            onSuccess: userId => {
                console.log("Reconnect successfully." + userId);
            },
            onTokenIncorrect: () => {
                console.log('token无效');
            },
            onError: errorCode => {
                console.log(errorcode);
            }
        };
        let config = {
            // 默认 false, true 启用自动重连，启用则为必选参数
            auto: true,
            // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
            url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
            // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
            rate: [100, 1000, 3000, 6000, 10000]
        };
        RongIMClient.reconnect(callback, config);
    }

    ready(func) {
        this._emiter.on('ready', func);
    }

    receive(func) {
        this._emiter.on('receive', func);
    }

    enter() {
        return new Promise((resolve, reject) => {
            let count = 50;// 拉取最近聊天最多 50 条。
            RongIMClient.getInstance().joinChatRoom(this.chatRoomId, count, {
                onSuccess: () => {
                    console.log('加入聊天室成功');
                    resolve();
                },
                onError: error => {
                    console.log('加入聊天室失败');
                    reject(error);
                }
            });
        });
    }

    exit() {
        return new Promise((resolve, reject) => {
            RongIMClient.getInstance().quitChatRoom(this.chatRoomId, {
                onSuccess: () => {
                    console.log('退出聊天室成功');
                    resolve();
                },
                onError: error => {
                    console.log('退出聊天室失败');
                    reject(error);
                }
            });
        });
    }

    send(text) {
        return new Promise((resolve, reject) => {
            let conversationType = RongIMLib.ConversationType.CHATROOM; // 类型为聊天室
            let msg = new RongIMLib.TextMessage({
                content: text,
                extra: '附加信息'
            });

            RongIMClient.getInstance().sendMessage(conversationType, this.chatRoomId, msg, {
                onSuccess: message => {
                    console.log('发送聊天室消息成功', message);
                    resolve({
                        user: message.senderUserId,
                        message: message.content.content
                    });
                },
                onError: (errorCode, message) => {
                    console.log('发送聊天室消息失败');
                    reject({ errorCode, message });
                }
            });
        });
    }

    getMessages() {
        return new Promise((resolve, reject) => {
            let count = 20; // 拉取的条数 count <= 200
            let order = 1;  // 1正序；0倒序
            RongIMClient.getInstance().getChatRoomHistoryMessages(this.chatRoomId, count, order, {
                onSuccess: (list, hasMore) => {
                    // list => 消息数组
                    // hasMore => 是否有更多的历史消息
                    console.log('消息数组', list);
                    console.log('是否有更多的历史消息', hasMore);
                    resolve({ list, hasMore });
                },
                onError: error => {
                    console.log('获取天室消息失败', error);
                    reject(error);
                }
            });
        });
    }

    getRoomInfo() {
        return new Promise((resolve, reject) => {
            /*
             需确认 当前用户 已加入聊天室
             */
            let order = RongIMLib.GetChatRoomType.REVERSE;// 排序方式。
            let memberCount = 20; // 获取聊天室人数 （范围 0-20 ）

            RongIMClient.getInstance().getChatRoomInfo(this.chatRoomId, memberCount, order, {
                onSuccess: chatRoom => {
                    console.log('获取聊天室信息成功', chatRoom);
                    console.log('聊天室成员', chatRoom.userInfos);
                    console.log('当前聊天室总人数', chatRoom.userTotalNums);
                    resolve(chatRoom);
                },
                onError: error => {
                    console.log('获取天室信息失败', error);
                    reject(error);
                }
            });
        });
    }

    destroy() {
        this.exit();
        this._emiter.off('ready');
        this._emiter.off('receive');
    }
};
