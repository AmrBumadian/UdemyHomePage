let coursesCategories = document.querySelector(".categories");

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

function addRating(rateSectionElement, courseRating, enrolledCount) {
    let ratingSpan = document.createElement("span");
    ratingSpan.innerText = courseRating;
    
    let enrolledCountSpan = document.createElement("span");
    enrolledCountSpan.classList.add("enrolled");
    enrolledCountSpan.innerText = `(${enrolledCount})`;
    
    rateSectionElement.appendChild(ratingSpan);
    
    let rateFloat = parseFloat(courseRating);
    while (rateFloat >= 1) {
        let star = document.createElement("i");
        star.setAttribute("class", "fa fa-star");
        star.setAttribute("aria-hidden", "true");
        rateSectionElement.appendChild(star);
        --rateFloat;
    }
    let star = document.createElement("i");
    
    if (rateFloat < 0.7) {
        star.setAttribute("class", "fa fa-star-half-o");
    } else {
        star.setAttribute("class", "fa fa-star-half-o");
    }
    star.setAttribute("aria-hidden", "true");
    rateSectionElement.appendChild(star);
    rateSectionElement.appendChild(enrolledCountSpan);
}

function addPrices(coursesPricingElement, courseCurrentPrice, courseOldPrice) {
    let currentPriceSpan = document.createElement("span");
    currentPriceSpan.classList.add("price");
    currentPriceSpan.innerText = courseCurrentPrice;

    let oldPriceSpan = document.createElement("span");
    oldPriceSpan.classList.add("old-price");
    oldPriceSpan.innerText = courseOldPrice;

    coursesPricingElement.appendChild(currentPriceSpan);
    coursesPricingElement.appendChild(oldPriceSpan);
}

function displayCourses(courseSection, coursesDataArray) {
    if (coursesDataArray.length == 0) {
        let noCoursesMessage = document.createElement("h1");
        noCoursesMessage.setAttribute("class", "empty-courses");
        noCoursesMessage.innerText = "There are no available courses."
        courseSection.appendChild(noCoursesMessage);
    }
    for (let course of coursesDataArray) {
        let courseImage = document.createElement("img");
        courseImage.setAttribute("src", course["image"]);
        courseImage.setAttribute("alt", course["alt-image"]);

        let courseName = document.createElement("h4");
        courseName.classList.add("course-name");
        courseName.innerText = course.name;

        let courseAuthor = document.createElement("h5");
        courseAuthor.classList.add("author");
        courseAuthor.innerText = course.author;

        let courseRating = document.createElement("section");
        courseRating.classList.add("rating");
        addRating(courseRating, course.rating, course.enrolled);

        let coursePrices = document.createElement("section");
        addPrices(coursePrices, course.currentPrice, course.oldPrice);
        
        let courseData = document.createElement("section");
        courseData.classList.add("course");
        courseData.appendChild(courseImage);
        courseData.appendChild(courseName);
        courseData.appendChild(courseAuthor);
        courseData.appendChild(courseRating);
        courseData.appendChild(coursePrices);

        courseSection.appendChild(courseData);
    }
}

function clearCoursesSection(courseSection) {
    while (courseSection.childNodes.length > 4) {
        courseSection.removeChild(courseSection.lastChild);
    }
}

function displayNewCourseCategory(courseCategoryObject) {
    let categorySection = document.querySelector(".category");
    let title = categorySection.querySelector("h3");
    let description = categorySection.querySelector(".category-description");
    let exploreButton = categorySection.querySelector("#explore-category");
    let courseSection = categorySection.querySelector(".courses");
    title.innerText = courseCategoryObject?.title ?? "";
    description.innerText = courseCategoryObject?.description ?? "";
    exploreButton.innerHTML = `Explore ${courseCategoryObject?.name ?? ""}`;
    clearCoursesSection(courseSection);
    displayCourses(courseSection, courseCategoryObject.courses);
}

let apiUrl = "http://localhost:8000/";

function fetchCoursesOfCategory(categoryName) {
    categoryName = categoryName.replace(/\s/g, "");
    fetch(apiUrl + categoryName)
        .then((response) => response.json())
        .then((data) => {
            displayNewCourseCategory(data)
        });
}