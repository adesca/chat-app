import {Chat} from "./chat";


const sidebarEl = document.querySelector('#sidebar');
if (sidebarEl) {
    const chat = new Chat((<HTMLDivElement> sidebarEl));
} else {
    console.error('there was no sidebar');
}
