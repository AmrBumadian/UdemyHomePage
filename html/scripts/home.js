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
    getCurrentCourses()
    event.stopPropagation();
});