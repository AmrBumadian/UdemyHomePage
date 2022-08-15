let coursesCategories = document.querySelector(".categories");
let timeout;
coursesCategories.addEventListener("click", event => {
    if (event.button !== 0) return;
    console.log(event.target.tagName);
    let previousClickedElement = coursesCategories.querySelector(".chosen-category");
    if (event.target.tagName != "LI" || previousClickedElement == event.target) return;
    let clickedListElement = event.target;
    previousClickedElement.classList.remove("chosen-category");
    clickedListElement.classList.add("chosen-category");
    console.log(clickedListElement);
    let currentCategory = clickedListElement.innerText;
    console.log(currentCategory);
    fetchCoursesOfCategory(currentCategory);
    event.stopPropagation();
});

function displayCourses(courseSection, coursesDataArray) {
    for (course in coursesDataArray) {

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