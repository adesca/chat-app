import {fetchResourceAsString} from "./util";
import {fromEvent} from "rxjs";
import {filter} from "rxjs/operators";

export class View implements IView {
    container: HTMLElement;

    constructor(private containingEl: HTMLDivElement) {
        this.container = containingEl;
    }

    renderChat: () => Promise<void> = async () => {
        this.container.innerHTML = await fetchResourceAsString('chat-area.html');
        fromEvent(this.getElOrThrow('textarea'), 'input')
            .pipe(
                // filter(event => event instanceof KeyboardEvent),
                filter((event) => {
                    if (event instanceof KeyboardEvent) {
                        return event.key === 'Enter'
                    } else {
                        return false
                    }
                })
            )
            .subscribe()
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

    private getElOrThrow<T extends HTMLElement>(selector: string) {
        const potentialEl = document.querySelector(selector);
        if (potentialEl) {
            return potentialEl;
        } else {
            throw new Error('Could not find element by selector ' + selector);
        }
    }
}

export class NoopView implements IView {
    name: string = 'nooper';
    room: string = '';
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

}

export interface IView {
    renderChat: () => Promise<void>;

    getRoom(): string;

    getName(): string;

    updateUserInfo(name: string, room: string): void;
}