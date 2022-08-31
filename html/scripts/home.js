let coursesCategories = document.querySelector(".categories");
let searchBar = document.querySelector("#search-bar");
let apiUrl = "http://localhost:8000/";
let allCoursesCache = [];

// search bar typing listener
let debouncer = (callback, delay) => {
    let timer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => callback.apply(context, args), delay);
    }
};
searchBar.addEventListener("input", debouncer(event => {
    let searchQuery = event.target.value;
    if (searchQuery === "") return;
    if (allCoursesCache.length === 0) fetchAllCoursesIn(allCoursesCache, searchQuery);
    else {
        let filteredCourses = filterCoursesByPattern(searchQuery);
        displaySearchResult(filteredCourses);
    }
}, 500));

// changing viewed course-category listener
coursesCategories.addEventListener("click", event => {
    if (event.button !== 0) return;
    let previousClickedElement = coursesCategories.querySelector(".chosen-category");
    if (event.target.tagName != "LI" || previousClickedElement == event.target) return;
    let clickedListElement = event.target;
    previousClickedElement.classList.remove("chosen-category");
    clickedListElement.classList.add("chosen-category");
    let currentCategory = clickedListElement.innerText;
    fetchCoursesOfCategory(currentCategory);
    event.stopPropagation();
});

function fetchCoursesOfCategory(categoryName) {
    categoryName = categoryName.replace(/\s/g, "");
    fetch(apiUrl + categoryName)
        .then((response) => response.json())
        .then((data) => {
            displayNewCourseCategory(data)
            slickIt();
        });
}

function fetchAllCoursesIn(allCoursesList, searchQuery) {
    fetch(apiUrl + "db")
        .then(response => response.json())
        .then(data => {
            fillAllCoursesData(allCoursesList, data);
            let filteredCourses = filterCoursesByPattern(searchQuery);
            displaySearchResult(filteredCourses);
            slickIt();
        });
}

function fillAllCoursesData(allCoursesList, data) {
    for (let category in data) {
        for (let course of data[category]["courses"]) {
            allCoursesList.push(course);
        }
    }
}

function displaySearchResult(categoryList) {
    let categorySection = document.querySelector(".category");
    let courseSection = categorySection.querySelector(".courses");
    categorySection.querySelector("h3").innerText = "";
    categorySection.querySelector(".category-description").innerText = "";
    categorySection.querySelector("#explore-category").hidden = true;
    clearCoursesSection(courseSection);
    displayAvailableCourses(courseSection, categoryList);
}

function filterCoursesByPattern(searchQuery) {
    let filteredCourses = [];
    for (let course of allCoursesCache) {
        if (course.name.search(new RegExp(searchQuery, "i")) != -1) {
            filteredCourses.push(course);
        }
    }
    return filteredCourses;
}

function displayNewCourseCategory(courseCategoryObject) {
    let categorySection = document.querySelector(".category");
    let categoryTitle = categorySection.querySelector("h3");
    let description = categorySection.querySelector(".category-description");
    let exploreButton = categorySection.querySelector("#explore-category");
    let courseSection = categorySection.querySelector(".courses");
    categoryTitle.innerText = courseCategoryObject ? .title ? ? "";
    description.innerText = courseCategoryObject ? .description ? ? "";
    exploreButton.hidden = false;
    exploreButton.innerHTML = `Explore ${courseCategoryObject?.name ?? ""}`;

    clearCoursesSection(courseSection);
    displayAvailableCourses(courseSection, courseCategoryObject.courses);
    slickIt();
}

// clears the course section with or with-out the buttons
function clearCoursesSection(courseSection, clearAllFlag) {
    let elementsToKeep = 0;
    courseSection.setAttribute("class", "courses");
    while (courseSection.childNodes.length > elementsToKeep) {
        courseSection.removeChild(courseSection.lastChild);
    }
}

function displayAvailableCourses(courseSection, coursesDataArray) {
    if (coursesDataArray.length === 0) {
        displayNoCourses(courseSection);
        return;
    }
    displayCourses(courseSection, coursesDataArray);
}

function displayNoCourses(courseSection) {
    let noCoursesMessage = document.createElement("h1");
    noCoursesMessage.setAttribute("class", "empty-courses");
    noCoursesMessage.innerText = "There are no available courses."
    courseSection.appendChild(noCoursesMessage);
}

function displayCourses(courseSection, coursesDataArray) {
    for (let course of coursesDataArray) {
        let courseImageElement = document.createElement("img");
        courseImageElement.setAttribute("src", course["image"]);
        courseImageElement.setAttribute("alt", course["alt-image"]);

        let courseNameElement = document.createElement("h4");
        courseNameElement.classList.add("course-name");
        courseNameElement.innerText = course.name;

        let courseAuthorElement = document.createElement("h5");
        courseAuthorElement.classList.add("author");
        courseAuthorElement.innerText = course.author;

        let courseRatingElement = document.createElement("section");
        courseRatingElement.classList.add("rating");
        appendRating(courseRatingElement, course.rating, course.enrolled);

        let coursePricesElement = document.createElement("section");
        appendPrices(coursePricesElement, course.currentPrice, course.oldPrice);

        let courseDataElement = document.createElement("section");
        courseDataElement.classList.add("course");
        courseDataElement.appendChild(courseImageElement);
        courseDataElement.appendChild(courseNameElement);
        courseDataElement.appendChild(courseAuthorElement);
        courseDataElement.appendChild(courseRatingElement);
        courseDataElement.appendChild(coursePricesElement);

        courseSection.appendChild(courseDataElement);
    }
}

function appendRating(rateSectionElement, courseRating, enrolledCount) {
    let ratingSpan = document.createElement("span");
    ratingSpan.innerText = courseRating;

    let enrolledCountSpan = document.createElement("span");
    enrolledCountSpan.classList.add("enrolled");
    enrolledCountSpan.innerText = `(${enrolledCount})`;

    rateSectionElement.appendChild(ratingSpan, courseRating);
    appendRatingStars(rateSectionElement, courseRating);
    rateSectionElement.appendChild(enrolledCountSpan);
}

function appendRatingStars(rateSectionElement, courseRating) {
    let rateFloat = parseFloat(courseRating);
    while (rateFloat >= 1) {
        let star = document.createElement("i");
        star.setAttribute("class", "fa fa-star");
        star.setAttribute("aria-hidden", "true");
        rateSectionElement.appendChild(star);
        --rateFloat;
    }
    let star = document.createElement("i");

    if (rateFloat < 0.7) star.setAttribute("class", "fa fa-star-half-o");
    else star.setAttribute("class", "fa fa-star-half-o");

    star.setAttribute("aria-hidden", "true");
    rateSectionElement.appendChild(star);
}

function appendPrices(coursesPricingElement, courseCurrentPrice, courseOldPrice) {
    let currentPriceSpan = document.createElement("span");
    currentPriceSpan.classList.add("price");
    currentPriceSpan.innerText = courseCurrentPrice;

    let oldPriceSpan = document.createElement("span");
    oldPriceSpan.classList.add("old-price");
    oldPriceSpan.innerText = courseOldPrice;

    coursesPricingElement.appendChild(currentPriceSpan);
    coursesPricingElement.appendChild(oldPriceSpan);
}