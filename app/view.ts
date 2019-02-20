import {fetchResourceAsString, fillTemplate} from "./util";
import {fromEvent} from "rxjs";
import {filter, tap} from "rxjs/operators";
import {ChatMessage, Message} from "./models";
import {Chat} from "./chat";

export class View implements IView {
    container: HTMLElement;

    constructor(private containingEl: HTMLDivElement, private chat: Chat) {
        this.container = containingEl;
    }

    renderChat: () => Promise<void> = async () => {
        this.container.innerHTML = await fetchResourceAsString('chat-area.html');
        this.getElOrThrow<HTMLButtonElement>('button').disabled = true;


        fromEvent(this.getElOrThrow('button'), 'click')
            .subscribe(click => {
                return this.chat.register(this.getName(), this.getRoom());
            })

        fromEvent(this.getElOrThrow('textarea'), 'keydown')
            .pipe(
                tap(event => console.log('event4$', event)),
                // filter(event => event instanceof KeyboardEvent),
                filter((event) => {
                    const evt = event as KeyboardEvent;
                    if (evt.key === 'Enter' && evt.shiftKey === false) {
                        return (event as KeyboardEvent).key === 'Enter';
                    }

                    return false;
                })
            )
            .subscribe(submissionEvent => {
                this.chat.sendMessage()
            })
    };

    getName(): string {
        return this.getNameInput().value;
    }

    getRoom(): string {
        return this.getRoomInput().value;
    }

    updateUserInfo(name: string, room: string): void {
        this.getNameInput().value = name;
        this.getRoomInput().value = room;
    }

    private getNameInput = () => {
        return document.querySelector('#name-input') as HTMLInputElement
    }

    private getRoomInput = () => {
        return document.querySelector('#room-input') as HTMLInputElement;
    }

    private getElOrThrow<T extends HTMLElement>(selector: string): T {
        const potentialEl = document.querySelector(selector);
        if (potentialEl) {
            return potentialEl as T;
        } else {
            throw new Error('Could not find element by selector ' + selector);
        }
    }

    addMessage(message: ChatMessage): void {
        fetchResourceAsString('user-message.html').then(html => {
            const messageTime = new Date(message.timestamp);
            const time = `${messageTime.toLocaleTimeString()}`;
            const interpolatedHtml = fillTemplate(html, {
                message: message.content,
                time: time
            });

            const messageDiv = document.createElement('div');
            messageDiv.innerHTML = interpolatedHtml;

            this.getElOrThrow('#message-container').appendChild(messageDiv);
        });
    }

    enableRegistration(): void {
        this.getElOrThrow<HTMLButtonElement>('button').disabled = false;
    }

    getMessage(): string {
        return (document.querySelector('textarea') as HTMLTextAreaElement).value;
    }
}

export class NoopView implements IView {
    name: string = 'nooper';
    room: string = '';
    messages: Message[] = [];
    renderChat: () => Promise<void> = () => {
        return Promise.resolve();
    };

    getName(): string {
        return name;
    }

    getRoom(): string {
        return this.room;
    }

    updateUserInfo(name: string, room: string): void {
        this.name = name;
        this.room = room;
    }

    addMessage(message: Message): void {
        this.messages.push(message);
    }

    enableRegistration(): void {
    }

    getMessage(): string {
        return "";
    }

}

export interface IView {
    renderChat: () => Promise<void>;

    getRoom(): string;

    getName(): string;

    updateUserInfo(name: string, room: string): void;

    addMessage(message: Message): void;

    enableRegistration(): void;

    getMessage(): string;
}