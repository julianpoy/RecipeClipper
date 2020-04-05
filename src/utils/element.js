export const getClassNamesMatching = (classNamePartial) => {
  const classRegExp = new RegExp(`class="((\\w|\\s|-)*${classNamePartial}(\\w|\\s|-)*)"`, 'gi');
  const matches = document.body.innerHTML.matchAll(classRegExp);

  return Array.from(new Set(Array.from(matches, (match) => match[1])));
};

export const softMatchElementsByClass = (classNamePartial) => {
  const classNames = getClassNamesMatching(classNamePartial);

  return classNames
    .map((className) => Array.from(document.getElementsByClassName(className)))
    .flat();
};

export const applyLIBlockStyling = (element) => {
  Array.from(element.querySelectorAll('li')).forEach((li) => {
    li.style.display = 'block';
  });

  return element;
};

export const grabLongestMatchByClasses = (preferredClassNames, fuzzyClassNames) => {
  const exactMatches = preferredClassNames
    .map((className) => Array.from(document.getElementsByClassName(className)))
    .flat();
  const fuzzyMatches = fuzzyClassNames
    .map((className) => softMatchElementsByClass(className))
    .flat();

  return (exactMatches.length > 0 ? exactMatches : fuzzyMatches)
    .map((element) => applyLIBlockStyling(element))
    .map((element) => element.innerText.trim())
    .reduce((max, match) => (match.length > max.length ? match : max), '');
};

export const isImg = (element) => element.tagName.toLowerCase().trim() === 'img';
export const isPicture = (element) => element.tagName.toLowerCase().trim() === 'picture';

export const getImgElementsWithin = (element) => {
  const matchedImgElements = [];
  if (isImg(element)) matchedImgElements.push(element);
  matchedImgElements.push(...element.querySelectorAll('img'));
  return matchedImgElements;
};

export const getAttrIfExists = (el, attrName) => {
  if (el.attributes[attrName]) return el.attributes[attrName].value;
  return '';
};

export const getSrcFromImage = (img) => {
  if (!img) return '';

  const closestSrc = getAttrIfExists(img, 'data-src') || getAttrIfExists(img, 'data-lazy-src') || img.currentSrc || img.src;
  return closestSrc || '';
};

export const isValidImage = (element) => isImg(element)
    && !!getSrcFromImage(element)
    && element.complete // Filter images that haven't completely loaded
    && element.naturalWidth > 0 // Filter images that haven't loaded correctly
    && element.naturalHeight > 0;

export const getImageDimensions = (element) => {
  const parent = element.parentNode;
  const isParentPicture = parent && isPicture(parent);
  const offsetHeight = isParentPicture
    ? Math.max(element.offsetHeight, parent.offsetHeight) : element.offsetHeight;
  const offsetWidth = isParentPicture
    ? Math.max(element.offsetWidth, parent.offsetWidth) : element.offsetWidth;

  return {
    offsetHeight,
    offsetWidth,
  };
};

export const grabLargestImage = () => {
  const matches = document.querySelectorAll('img');

  return [...matches]
    .filter((element) => isValidImage(element))
    .reduce((max, element) => {
      const { offsetWidth, offsetHeight } = getImageDimensions(element);

      // Do not use images smaller than 200x200
      if (offsetWidth < 200 && offsetHeight < 200) return max;

      const elTotalPx = offsetHeight * offsetWidth;
      const maxTotalPx = max ? (max.offsetHeight * max.offsetWidth) : 0;

      return elTotalPx > maxTotalPx ? element : max;
    }, null);
};

export const closestToRegExp = (regExp) => {
  const match = document.body.innerText.match(regExp);
  if (!match) return '';
  return match[0];
};

export const grabRecipeTitleFromDocumentTitle = () => document.title.split(/ - |\|/)[0].trim();

export const grabSourceFromDocumentTitle = () => (document.title.split(/ - |\|/)[1] || '').trim();
