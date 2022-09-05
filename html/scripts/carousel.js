$(document).ready(slickIt());

function slickIt() {
    $('.courses').slick({
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        nextArrow: document.getElementById("next-button"),
        prevArrow: document.getElementById("prev-button"),
        responsive: [{
                breakpoint: 800,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 720,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 520,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ],
    })
}