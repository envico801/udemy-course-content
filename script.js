// ==UserScript==
// @name         Udemy curriculum getter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// ==/UserScript==

(function start(argument) {
  setTimeout(() => {
    const courseCurriculumSel = '[data-purpose="course-curriculum"]';
    const courseCurriculum = this.document.querySelector(courseCurriculumSel);

    const secondDivSel = 'div:nth-child(3)';
    const secondDiv = courseCurriculum.querySelector(secondDivSel);

    const showMoreSectionsBtnSel = 'button[data-purpose="show-more"]';
    const showMoreSectionsBtn = this.document.querySelector(
      showMoreSectionsBtnSel
    );
    showMoreSectionsBtn.click();

    const curriculum = new Map();
    const parts = secondDiv.querySelectorAll(':scope > div');
    for (part of parts) {
      const partTitleElem = part.querySelector(
        'h3 button span span:nth-child(1)'
      );
      const partTitle = partTitleElem.textContent;
      const chapters = part.querySelectorAll('div ul li');
      curriculum.set(partTitle, []);
      //curriculum['parts'][partTitle] = {
      //chapters,
      //};

      for (chapter of chapters) {
        const chapterTitleElem = chapter.querySelector('div div span');
        const chapterTitle = chapterTitleElem.textContent;
        curriculum.set(partTitle, [...curriculum.get(partTitle), chapterTitle]);
      }
    }

    function integerToRoman(num) {
      const romanNumerals = {
        1: 'I',
        4: 'IV',
        5: 'V',
        9: 'IX',
        10: 'X',
        40: 'XL',
        50: 'L',
        90: 'XC',
        100: 'C',
        400: 'CD',
        500: 'D',
        900: 'CM',
        1000: 'M',
      };

      let result = '';

      const values = Object.keys(romanNumerals).reverse();

      // Iterate over the Roman numeral values in descending order
      for (let i = 0; i < values.length; i++) {
        const value = parseInt(values[i]);

        while (num >= value) {
          result += romanNumerals[value];
          num -= value;
        }
      }

      return result;
    }

    let markdownText = `# XXXX-X - Xxxxxxx - xxxx xxxx\n\n## Questions\n\n`;
    const iterMap = Array.from(curriculum);
    let partCount = 1;
    let chapterCount = 1;
    for (part of iterMap) {
      const partTitle = part[0];
      const partTemplate = `### Part ${integerToRoman(
        partCount
      )} - ${partTitle}\n\n`;
      partCount++;

      markdownText += partTemplate;

      const chapters = part[1];
      for (chapterTitle of chapters) {
        const chapterTemplate = `#### Chapter ${chapterCount} - ${chapterTitle}\n\n`;

        chapterCount++;

        markdownText += chapterTemplate;
      }

      //const chapterTemplate = `#### Chapter ${chapterCount} - Extras\n\n`;
      //markdownText += chapterTemplate;

      chapterCount = 1;
    }

    markdownText += `---`;

    console.log(markdownText);
  }, 5000);
})();
