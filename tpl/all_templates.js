var menu_builder_templates =
{
    itemTemplate: function(link, title)
    {
        return  '<li class="item">' +
            '<a href="' + link + '">' + title + '</a>' +
            '<a href="#" class="add-item">+</a>' +
            '<a href="#" class="edit-item">✎</a>' +
            '<a href="#" class="delete-item">✕</a>' +
            '</li>';
    },

    itemTemplateWithContainer: function(level, link, title)
    {
        return  '<ul class="ul-level-' + (level + 1) + '">' +
            '<li class="item">' +
            '<a href="' + link + '">' + title + '</a>' +
            '<a href="#" class="add-item">+</a>' +
            '<a href="#" class="edit-item">✎</a>' +
            '<a href="#" class="delete-item">✕</a>' +
            '</li>' +
            '</ul>';
    },

    addMainCategoryButton: '<a id="add-main-cat" href="#">+ Add main category</a>',

    getCategoryBox:
    '<div class="add">' +
        '<a class="close" href="#">✕</a>'+
        '<label>Enter category name:</label> <br>' +
        '<input type="text" class="textInput"> <br>' +
        '<label>Enter link:</label> <br>' +
        '<input type="text" class="linkInput"> <br>' +
        '<button class="b-add">Add</button>' +
    '</div>'
};