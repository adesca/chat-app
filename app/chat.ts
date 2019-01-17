import {fetchResourceAsString} from "./util";
import SockJS from "sockjs-client";
import {over} from "stompjs";
import {IView, NoopView, View} from "./view";
import {Message} from "./models";
import {Observable, Subject} from "rxjs";

export class Chat {
    view: IView;
    socket = new SockJS('http://localhost:8080/chat');
    stompClient = over(this.socket);

    messagesObservable: Subject<Message> = new Subject();

    constructor(private sidebarEl: HTMLDivElement) {
        if (sidebarEl) {
            this.view = new View(sidebarEl);
        } else {
            this.view = new NoopView();
        }

        this.view.renderChat().then(() => {
            const that = this;

            this.stompClient.connect({}, function (frame) {
                that.subscribeToChannel<Message>('/topic/messages').subscribe(message => {

                });

                that.subscribeToChannel<Message>('/user/queue/me').subscribe(message => {
                    that.view.updateUserInfo(message.name, message.room);
                });


                const greeting: Message = {room: that.view.getRoom(), name: that.view.getName()};
                that.stompClient.send('/app/register', {}, JSON.stringify(greeting));
            });
        })
    }

    subscribeToChannel<T extends Message>(channel: string): Observable<T> {
        const messageSubscribable = new Subject<T>();
        this.stompClient.subscribe(channel, message => {
            console.log('Bubbling message ', message);
            const parsedMessage: T = JSON.parse(message.body);
            messageSubscribable.next(parsedMessage)
        })

        return messageSubscribable;

    }
}
