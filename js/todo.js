$(document).ready(function() {

    var loadList = function(){

        var testdata = localStorage.getItem('data');

        if(!testdata){
            localStorage.setItem('data', JSON.stringify([]));
        };

        var rdata = JSON.parse(localStorage['data']);

        $.each(rdata, function(index, value){

            output = '';
            output += '<li class="task">';
            output += value;
            output += '</li>'

            $('#todo-list').append(output);

        });

        var testdone = localStorage.getItem('doneList');

        if(!testdone){
            localStorage.setItem('doneList', JSON.stringify([]));
        };

        var ddata = JSON.parse(localStorage['doneList']);

        $.each(ddata, function(index,value){
            output = '';
            output += '<li class="task">';
            output += value;
            output += '</li>'

            $('#done-list').append(output);
        });

    }

    loadList();

    var addItem = function(){

        var testdata = localStorage.getItem('data');

        if(!testdata){
            localStorage.setItem('data', JSON.stringify([]));
        };

        var data = JSON.parse(localStorage['data']);

        list = $('#todo-list');

        var task = $('#todo-field').val();

        if (!task){ return false; }

        output = '';
        output += '<li class="task">';
        output += task;
        output += '</li>';

        list.append(output);

        data.push(task);

        localStorage.setItem('data', JSON.stringify(data));

        $('#todo-field').val('');

    }

    $('#submit-todo').on('click', function(){

        addItem();

    });

    $('#todo-field').on('keydown', function(e){

        if (e.keyCode == 13) {

            //Don't type the key
            e.preventDefault();

            //Searh using live cc mode
            addItem();

        }

    });

    var removeFromArray = function(scope, delegate, localArray, callback){

        //Define the scope click event and the delegate
        $(scope).on('click', delegate, function(){

            //Define the delegate item
            var delegate = $(this);

            //Destroy the delegate item
            delegate.remove();

            //Define the text to remove from the array
            var killThis = $(this).text();

            //Get the stored array of data
            var data = JSON.parse(localStorage[localArray]);

            //Get the index of the item to remove
            var removeIndex = $.inArray(killThis, data);

            //Splice out the item we are removing
            data.splice(removeIndex, 1);

            //Set the stored array of data
            localStorage.setItem(localArray, JSON.stringify(data));

        });
    }

    var handleDone = function(doneItem){

        console.log(doneItem);

        $('#done-list').append(doneItem);

        var testdata = localStorage.getItem('doneList');

        if(!testdata){
            localStorage.setItem('doneList', JSON.stringify([]));
        }

        var data = JSON.parse(localStorage['doneList']);

        data.push(doneItem.text());

        localStorage.setItem('doneList', JSON.stringify(data));

    }

    removeFromArray('#done-list', 'li', 'doneList');

    removeFromArray('#todo-list', 'li', 'data')

    $("#todo-list").on('click', 'li', function(){

        var listItem = $(this);

        handleDone(listItem);

    });

    $('#swapper').on('click', function(){
        var todoWrapper = $('.todo-wrapper');
        var title = $('.todo-wrapper h4 span');
        $(todoWrapper).toggleClass('flipped');
        if ($(title).text() == 'To-Do'){
            $(title).text('Done');
        } else {
            $(title).text('To-Do');
        }
        
    });

});
