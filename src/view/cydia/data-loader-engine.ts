import $ from 'jquery';

interface ContentInfo {
    type: string;
    source?: string;
    url?: string;
    text?: string;
    params?: [string, string][];
    paragraphElement?: string;
    titleSource?: string;
    titleElement?: string;
    paragraphContainer?: string;
    paragraphSource?: string;
    reverseRender?: boolean;
    emptyListCallback?: (element: JQuery) => void;
    render?: (element: JQuery, xmlData: JQuery) => void;
}

export const dataLoaderEngine = (contentBlocks: Record<string, ContentInfo>, xml: Document) => {
    $.each(contentBlocks, function (key: string, contentInfo: ContentInfo) {
        console.log('Processing ' + key);
        console.log('  type= ' + contentInfo.type);

        if (!$(key).length) {
            return;
        }

        switch (contentInfo.type) {
            case 'text':
                const content = $(xml).find(contentInfo.source!).text();
                $(key).html(content);
                break;
            case 'link':
                console.log('  url= ' + contentInfo.url);
                console.log('  text= ' + contentInfo.text);

                let url = contentInfo.url!;
                const params: string[] = [];
                if (contentInfo.params) {
                    $.each(contentInfo.params, function () {
                        this[1] = encodeURIComponent(this[1]);
                        params.push(this.join('='));
                    });
                }
                url = url + '?' + params.join('&');
                $(key).append($('<a></a>').attr('href', url).text(contentInfo.text ?? ''));
                break;
            case 'list':
                let list = $(xml).find(contentInfo.source!);

                if (list.length == 0) {
                    if (contentInfo.emptyListCallback) {
                        contentInfo.emptyListCallback($(key));
                    }
                } else {
                    if (!!contentInfo.reverseRender) {
                        list = $(list.get().reverse());
                    }
                    $.each(list, function (_: number, value: Element) {
                        const item = $(value).text();

                        if (!!contentInfo.reverseRender) {
                            $(key).prepend($(contentInfo.paragraphElement!).html('<p>' + item + '</p>'));
                        } else {
                            $(key).append($(contentInfo.paragraphElement!).html('<p>' + item + '</p>'));
                        }
                    });
                }
                break;
            case 'articles':
                const articles = $(xml).find(contentInfo.source!).children();
                let titleID = 0;
                $.each(articles, function (_: number, article: Element) {
                    const articleTitle = $(article).find(contentInfo.titleSource!).text();
                    $(key).append($(contentInfo.titleElement!).html(articleTitle));
                    const container = $(contentInfo.paragraphContainer!).attr('id', (++titleID).toString());
                    $(key).append(container);
                    $.each($(article).find(contentInfo.paragraphSource!), function (_: number, paragraph: Element) {
                        $(container).append(
                            $(contentInfo.paragraphElement!).html('<p>' + $(paragraph).text() + '</p>')
                        );
                    });
                });
                break;
            case 'custom':
                if (!key) {
                    return;
                }
                contentInfo.render!($(key), $(xml).find(contentInfo.source!));
                break;
        }
    });
}
