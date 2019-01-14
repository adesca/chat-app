import {fetchResourceAsString} from "./util";
import SockJS from "sockjs-client";
import {over} from "stompjs";

export class Chat {
    constructor(private sidebarEl: HTMLDivElement) {
        this.createChat(sidebarEl);
    }


    private async createChat(sidebarEl: HTMLDivElement) {
        fetchResourceAsString('chat-area.html').then(chatHtml => {
            this.sidebarEl.innerHTML = chatHtml;

            // const socket2 = createServer('http://localhost:8080/chat');
            const socket = new SockJS('http://localhost:8080/chat');
            const stompClient = over(socket);

            stompClient.connect({}, function (frame) {
                // setConnected(true);
                console.log('Connected');
                stompClient.subscribe('/topic/messages', function (message) {
                    console.log('message ', message);
                });

                stompClient.send('/app/chat/aTopic', {}, '{}');

                stompClient.subscribe('/queue/init', function (greeting) {
                    console.log('greeting ', greeting);
                    // showGreeting(JSON.parse(greeting.body).content);
                });
            });
        })

    }
}
