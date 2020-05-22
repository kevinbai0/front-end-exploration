i
export const defaultArti
const dateStr = `Mar 02, 2020`;
const timeStr = `10:40 am`;
const imgSrc = ``;
const categories = [{articleName:`Hello world`,author:`Kevin Bai`},{articleName:`Writing your interpreter`,author:`Kevin Bai`}];

interface Props {

}
export const MenuColumn: React.FC<Props> = ({}) => {
;return <></>
}
g
imgSrc: string
}
categories?: string[]
articleSelected?: (article: typeof defaultArticle) => void
}
export const Page: React.FC<Props> = ({name, dateStr, articles, weather, featuredArticle, authorOfMonth, categories, articleSelected}) => {
const $name = name || `Kevin`;const $dateStr = dateStr || `Feb 02 2020`;const $articles = articles || [defaultArticle];const $weather = weather || defaultWeather;const $featuredArticle = featuredArticle || defaultArticle;const $authorOfMonth = authorOfMonth || {name:`Kevin`,imgSrc:``};const $categories = categories || [`Dogs`,`Cats`];const $articleSelected = articleSelected || undefined;return <></>
}
