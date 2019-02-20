import {fetchResourceAsString} from "./util";
import SockJS from "sockjs-client";
import {over} from "stompjs";
import {IView, NoopView, View} from "./view";
import {ChatMessage, Message} from "./models";
import {Observable, Subject} from "rxjs";

export class Chat {
    view: IView;
    socket = new SockJS('http://localhost:8080/app');
    stompClient = over(this.socket);

    messagesObservable: Subject<Message> = new Subject();

    constructor(private sidebarEl: HTMLDivElement) {
        if (sidebarEl) {
            this.view = new View(sidebarEl, this);
        } else {
            this.view = new NoopView();
        }

        this.view.renderChat().then(() => {
            const that = this;

            this.stompClient.connect({}, function (frame) {


                that.subscribeToChannel<Message>('/user/queue/me').subscribe(message => {
                    that.view.updateUserInfo(message.name, message.room);

                    that.subscribeToChannel<ChatMessage>(`/topic/room/${message.room}/messages`).subscribe(message => {
                        that.view.addMessage(message);
                    });
                });

                that.view.enableRegistration();
            });
        })
    }

    register(name1: string, roomInput: string): void {
        const greeting: Message = {room: roomInput, name: name1};
        this.stompClient.send('/app/register', {}, JSON.stringify(greeting));
    }

    sendMessage(): void {
        const message = {} as ChatMessage;
        message.content = this.view.getMessage();
        const room = this.view.getRoom();
        this.stompClient.send(`/app/room/${room}/messages`, {}, JSON.stringify(message));
    }


    private subscribeToChannel<T extends Message>(channel: string): Observable<T> {
        const messageSubscribable = new Subject<T>();
        this.stompClient.subscribe(channel, message => {
            console.log('Bubbling message ', message, ' from channel ', channel);
            const parsedMessage: T = JSON.parse(message.body);
            messageSubscribable.next(parsedMessage)
        })

        return messageSubscribable;

    }
}
