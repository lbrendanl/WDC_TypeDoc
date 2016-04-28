// This is a sample connector using the JSON Placeholder ( http://jsonplaceholder.typicode.com) 
// service. The connector will utilize the posts and comments endpoints to demonstrate how to 
// use the multiple table API. The connector allows the user to enter a user id, then retrieves 
// a list of posts for that user and includes all of the comments for each post. The connection 
// that will be made will contain 2 tables: posts and comments. The two tables will be joined 
// together by the post's id

// start with the normal makeConnector thing
var myConnector = tableau.makeConnector();

// Define our first new function, getSchema. Our schema 
// here is going to combine posts for a particular user with comments
// about those posts. Thus, posts will be our primary table
myConnector.getSchema = function(schemaCallback) {
    // Start by defining the tables

    // This is a TableInfo object
    var postsTable = {
        id: "posts_table",
        alias: "Posts",
        description: "Represents a forum post",
        incrementColumn: "id",
        columns:
        [
          {
              id: "id",
              alias: "ID",
              dataType: "int",
              description: "The id of the post",
              primaryKey: true,
          },
          {
              id: "post_title",
              alias: "Title",
              dataType: "string",
              description: "The title of the post"
          },
          {
              id: "post_body",
              alias: "Body",
              dataType: "string",
              description: "The body of the post"
          }
        ]
    };

    // This is a TableInfo object
    var commentsTable = {
        id: "comments_table",
        alias: "Comments",
        description: "Represents a a comment made for a particular post",
        columns:
        [
          {
              id: "id",
              alias: "ID",
              dataType: "int",
              description: "The id of the comment",
              primaryKey: true
          },
          {
              id: "post_id",
              alias: "Post ID",
              dataType: "int",
              description: "The id of the post that this comment is for",
              foreignKey: {
                  tableId: "posts_table",
                  columnId: "id"
              }
          },
          {
              id: "commenter_name",
              alias: "Commenter Name",
              dataType: "string",
              description: "The name of the author of the comment"
          },
          {
              id: "comment_body",
              alias: "Comment Body",
              dataType: "string",
              description: "The body of the comment"
          }
        ]
    };

    // This is a JoinInfo object
    var postCommentJoin = {
        left: {
            tableId: "posts_table",
            columnId: "id"
        },
        right: {
            tableId: "comments_table",
            columnId: "postId"
        },
        joinType = "left", // Do a left join so we get every post even if it doesn't have comments
        joinOperation = "="
    };

    // This is a SchemaInfo object
    var completeSchema = {
        tables : [postsTable, commentsTable],
        joins : [postCommentJoin]
    };

    // Use the schemaCallback in order to pass this info back to Tableau
    schemaCallback(completeSchema);
}

// This is the second new function to define. The function will first go off an collect
// all of the posts that the particular user id has written (this info is provided by the
// the user in the interactive phase). For each post, another request will be made to retrieve
// the comments for that post. After all of these comments requests are finished executing and 
// have returned their data to tableau, the connector reports it has finished.
myConnector.getData = function(tables, isIncrementalRefresh, dataSinkFn, doneCallback) {
    var rootUrl = "http://jsonplaceholder.typicode.com/";

    // This is the url we'll use to get all of a user's posts
    var postsUrl = rootUrl + "posts?userId=" + tableau.connectionData;
    $.getJSON(postsUrl, function(postsData) {

        // Save off all of the concurrent requests we are making to retrieve 
        // comments in an array so we can wait for them all to finish before telling tableau we're done
        var commentRequests = [];

        var posts = [];

        // Go through every post returned and retrieve its comments
        for (var i = 0; i < postsData.length; i++) {

            // Gather information about the particular post we are processing
            var postJson = postsData[i];
            var postData = {
                id: postJson.id,
                post_title: postJson.title,
                post_body: postJson.body
            };

            // Call back to Tableau with our data for this post
            var msg = "Processing post " + i.toString() + " of " + postsData.length.toString();
            dataSinkFn([postData], msg, "posts_table");

            // Get the url to get just the comments for this post
            var commentsUrl = rootUrl + "comments?postId=" + postData.id.toString();
            var request = $.getJSON(commentsUrl, function(commentsData) {
                var commentRows = [];

                // Go through every comment for this post and process it
                for (var j = 0; j < commentsData.length; j++) {

                    // Gather information about this particular comment
                    var commentJson = commentsData[j];
                    var commentData = {
                        id: commentsData.id,
                        postId : commentsData.postId,
                        commenter_name: commentsData.name,
                        comment_body: commentsData.body
                    };

                    commentRows.push(commentData);
                }

                var statusMessage = "Finished processing post " + i.toString() + " of " + postsData.length.toString();

                // Actually make the callback with our payload & status message
                dataSinkFn(commentRows, statusMessage, "comments_table");
            });

            // Add this request to our collection of requests so we don't lose track of it
            commentRequests.push(request);
        }

        // User jquery's when functionality to wait for all of the commentRequests being sent. See http://stackoverflow.com/a/5627301 for a description
        $.when.apply($, commentRequests).then(function() {
            // Now that all of my requests have finished, indicate to Tableau that we're done
            doneCallback();
        })
    });
}

tableau.registerConnector(myConnector);

$(document).ready(function() {
    $("#submitButton").click(function() {
        var userInput = $("#userInput").val().trim();
        tableau.connectionData = userInput;
        tableau.connectionName = userInput.toString() + "'s posts";
        tableau.submit();
    });
});
