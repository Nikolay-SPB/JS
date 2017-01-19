/* TODO: localization */

var menu_builder = function()
{
    var main_container;
    var main_data;
    var self = this;

    var dialogCallback;

    this.init = function(data, container)
    {
        main_container = container;
        main_data = data;
        container.append('<a id="add-main-cat" href="#">+ Add main category</a>');
        container.append('<div class="add">' +
            '<a class="close" href="#">✕</a>'+
            '<label>Enter category name:</label> <br>' +
            '<input type="text" class="textInput"> <br>' +
            '<label>Enter link:</label> <br>' +
            '<input type="text" class="linkInput"> <br>' +
            '<button class="b-add">Add</button>' +
            '</div>');
        self.renderData(data);
        self.handleEvents(container);

        return self;
    };

    this.renderData = function(data, level)
    {
        var i;
        level = level ? level : 0;

        if (level == 0) {
            main_container.append('<ul class="ul-level-' + level + '"></ul>');
        } else {
            main_container.find('ul.ul-level-'+(level-1)).append('<ul class="ul-level-' + level + '"></ul>');
        }

        for (i in data) {
            main_container.find('ul.ul-level-'+level).append(
                '<li class="item">' +
                    '<a href="'+data[i].link+'">'+data[i].title+'</a>' +
                    '<a href="#" class="add-item">+</a>'+
                    '<a href="#" class="edit-item">✎</a>' +
                    '<a href="#" class="delete-item">✕</a>' +
                '</li>'
            );
            if (data[i].children) {
                self.renderData(data[i].children, level+1);
            }
        }
    };

    this.removeElements = function()
    {
        main_container.find('ul.ul-level-0').remove();
    };

    this.handlerAddCategory = function(element)
    {
        var ul = $(element).parent().next('ul');
        var item = $(element);

        var level = Number($(element).parent().parent().attr('class').match(/ul-level-([0-9]+)/)[1]);

        self.getCategoryInfo(function(title, link)
        {
            if (title && link) {
                if (ul.length > 0) {
                    ul.append(
                        '<li class="item">' +
                            '<a href="' + link + '">' + title + '</a>' +
                            '<a href="#" class="add-item">+</a>' +
                            '<a href="#" class="edit-item">✎</a>' +
                            '<a href="#" class="delete-item">✕</a>' +
                        '</li>'
                    );
                } else {
                    item.parent().after(
                        '<ul class="ul-level-' + (level + 1) + '">' +
                        '<li class="item">' +
                        '<a href="' + link + '">' + title + '</a>' +
                        '<a href="#" class="add-item">+</a>' +
                        '<a href="#" class="edit-item">✎</a>' +
                        '<a href="#" class="delete-item">✕</a>' +
                        '</li>' +
                        '</ul>'
                    );
                }
            }
        });
    };

    this.handlerDeleteCategory = function(element)
    {
        if (confirm('Are you sure that you want to delete this category? If category contains subcategories, all subcategories will be deleted also.')) {
            var ul = $(element).parent().parent();
            var li = $(element).parent();
            var ul_w_childs = $(element).parent().next('ul');

            if (ul.find('li').length == 1) {
                li.remove();
                ul.remove();
            } else {
                li.remove();
            }

            if (ul_w_childs.length > 0) {
                ul_w_childs.remove();
            }
        }
    };

    this.handlerEditCategory = function(element)
    {
        var a = $(element).parent().children('a').first();

        self.getCategoryInfo(function(title, link)
        {
            a.text(title);
            a.attr('href', link);

        }, a.text(), a.attr('href'));
    };

    this.handleEvents = function()
    {
        var add_button = main_container.find('.add');

        /* Main delegate */
        main_container.click(function(e)
        {
            switch (e.target.className) {
                case 'add-item':
                    self.handlerAddCategory(e.target);
                    break;

                case 'delete-item':
                    self.handlerDeleteCategory(e.target);
                    break;

                case 'edit-item':
                    self.handlerEditCategory(e.target);
                    break;
            }
        });

        $('#add-main-cat').click(function()
        {
            self.getCategoryInfo(function(title, link)
            {
                if (title && link) {
                    main_data.push({
                        title: title,
                        link: link
                    });

                    self.removeElements();
                    self.renderData(main_data);
                }
            });
        });

        main_container.find('.b-add').click(function()
        {
            var add_button = main_container.find('.add');

            var title = add_button.find('input.textInput').val();
            var link = add_button.find('input.linkInput').val();

            dialogCallback(title, link);

            add_button.find('input.textInput').val('');
            add_button.find('input.linkInput').val('');

            add_button.hide();
        });

        main_container.find('.close').click(function()
        {
            $(this).parent().hide();

            return false;
        });
    };

    this.getCategoryInfo = function(callback, initial_title, initial_link)
    {
        var add_button = main_container.find('.add');

        dialogCallback = callback;

        if (initial_title)
            main_container.find('input.textInput').val(initial_title);

        if (initial_link)
            main_container.find('input.linkInput').val(initial_link);

        add_button.show();
    };

    this.exportMenuToJSON = function(level, object)
    {
        var endJSON = [];

        level = level || 0;

        if (level == 0) {
            $('ul.ul-level-' + level + ' > li').each(function () {
                endJSON.push({
                    title: $(this).find('a:nth-child(1)').html(),
                    link: $(this).find('a:nth-child(1)').attr('href')
                });

                if ($(this).next('ul').length > 0) {
                    endJSON[endJSON.length - 1].children = self.exportMenuToJSON(level + 1, $(this).next('ul'));
                }
            });
        } else {
            object.children('li').each(function ()
            {
                endJSON.push({
                    title: $(this).find('a:nth-child(1)').html(),
                    link: $(this).find('a:nth-child(1)').attr('href')
                });

                if ($(this).next('ul').length > 0) {
                    endJSON[endJSON.length - 1].children = self.exportMenuToJSON(level + 1, $(this).next('ul'));
                }
            });
        }

        return endJSON;
    };
};