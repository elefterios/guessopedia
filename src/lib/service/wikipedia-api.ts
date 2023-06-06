const apiBaseFeatured = "https://api.wikimedia.org/feed/v1/wikipedia/en/featured/";
const apiBaseBacklink = "https://en.wikipedia.org/w/api.php?action=query&format=json&bllimit=100&blnamespace=0&list=backlinks&origin=*&blpageid=";

type ArticleData = { img: HTMLImageElement; choices: any[]; max_choices: number; correctChoiceIdx: number };
let cachedNext: Promise<ArticleData>;

export const getRandomArticle = async (max_choices = 10): Promise<ArticleData> => {
  while (true) {
    try {
      let ret = await cachedNext;
      if (!ret || ret.max_choices != max_choices) ret = await loadNext(max_choices);
      cachedNext = loadNext(max_choices);
      return ret;
    } catch (e) {
      cachedNext = loadNext(max_choices);
    }
  }
};

const loadNext = async (max_choices = 10) => {
  let featuredArticleJson = null;
  // Api sometimes fails? Keep retrying until we get a parsable answer
  while (!featuredArticleJson?.tfa.originalimage) featuredArticleJson = await (await fetch(apiBaseFeatured + getRandomDate())).json();

  const backlinksJson = await (await fetch(apiBaseBacklink + featuredArticleJson.tfa.pageid)).json();

  const img = new Image();
  img.src = featuredArticleJson.tfa.originalimage.source;

  const choices = shuffle(backlinksJson.query.backlinks.map((bl: any) => bl.title).slice(0, max_choices - 1));

  const correctChoice = featuredArticleJson.tfa.title;
  const correctChoiceIdx = Math.floor(Math.random() * (choices.length - 1));

  choices.splice(correctChoiceIdx, 0, correctChoice);

  console.log("Preloaded next.");

  return {
    img,
    choices,
    max_choices,
    correctChoiceIdx,
  };
};

const shuffle = (array: any[]) => {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const millisInADay = 86400000;
const startDateEpoch = 1451602800000; // 2016 01 01
const daysUntilEnd = 2712; // Days between 2016 01 01 - 2023 06 05

const getRandomDate = () => {
  const randDay = Math.floor(Math.random() * daysUntilEnd);
  const randDate = new Date(randDay * millisInADay + startDateEpoch);
  return randDate.toISOString().replaceAll("-", "/").substring(0, 10);
};
