// // Grab the articles as a json
// $.getJSON("/articles", function (data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//         // Display the apropos information on the page
//         $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     }
// });
// $(document).ready(function() {
//     $(".modal").modal('hide');
// });


// $(document).ready(function() {
//     $("#scrape").on("click", function() {
//         $("#scrapeModal").modal('show')
//     });
// });

// $(document).ready(function() {
//     $("#saveArticle").on("click", function() {
//         $("#saveModal").modal('show')
//     });
// });

// $(document).ready(function() {
//     $("#createNote").on("click", function() {
//         $("#noteModal").modal('show')
//     });
// });

// $('#scrapeModal').on('shown.bs.modal', function () {
//     $('#scrape').trigger('focus')
// })

// $('#saveModal').on('shown.bs.modal', function () {
//     $('#saveArticle').trigger('focus')
// })

// $('#noteModal').on('shown.bs.modal', function () {
//     $('#createNote').trigger('focus')
// })


$(document).on("click", "#scrape", function () {
    event.preventDefault();
    $.get("/scrape", function (data) {
        location.reload("/")
    }).catch(function (err) {
        res.json(err)
    })
});

$(document).on("click", "#saveArticle", function () {
    event.preventDefault();
    var id = $(this).attr("data-id"); 
    $.ajax("/articles/" + id, {
        type: "PUT",
        data: {id}
    }).then(
        console.log("Article saved!"),
        $(this).hide()  
    ).catch(function (err) {
        res.json(err)
    })
})

$(document).on("click", "#deleteSavedArticle", function () {
    event.preventDefault();
    var id = $(this).attr("data-id");
    $.ajax("/removeArticles/" + id, {
        type: "PUT",
        data: {id}
    }).then(
        console.log("articleDeleted")       
    ).catch(function (err) {
        res.json(err)
    })
})

$(document).on("click", "#clearArticles", function() {
    $.ajax("/deleteArticles", {
        type: "DELETE"
    }).then(function(){
        location.reload("/");
    });
});

$(document).on("click", "#saveNote", function() {
    event.preventDefault();
    var id = $(this).attr("data-id")
    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            body: $("#message-text").val().trim()
        }
    }).then(function(data) {
        console.log(data);
        alert("Note Saved");
    })
    

})

