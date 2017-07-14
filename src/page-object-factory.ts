import { EventListPage } from './page-objects/event-list-page';

export class PageObjectFactory {
    createEventListPage(html: string) {
        return new EventListPage(html);
    }
}
