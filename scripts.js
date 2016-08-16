var symbolGroup = [];

$(document).ready(function(){
    var savedList = document.getElementsByClassName('savedSymbols')[0];
    savedList.innerHTML = localStorage.length;

    var content;


    $('.yahoo-form').submit(function(){
        event.preventDefault();
        var symbol = $('#symbol').val();
        var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("' + symbol + '")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
        console.log(url);

        $.getJSON(url, function(theData){
            var stockInfo = theData.query.results.quote;
            var stockCount = theData.query.count;
            var newHTML = '';
            if (stockCount > 1){
                console.log(stockInfo);
                for (var i = 0; i < stockInfo.length; i++) {
                    newHTML += buildNewTable(stockInfo[i]);
                    $('.yahoo-body').html(newHTML);
                    // saveObj(stockInfo[i]);
                    // deleteObj(stockInfo[i]);
                } 
            }else{
                newHTML += buildNewTable(stockInfo);
                $('.yahoo-body').html(newHTML);
                // saveObj(stockInfo);
                // deleteObj(stockInfo);
            }
            $('.table').DataTable();

            $('.saveButton').click(function(){
                content = $(this).parents('tr').children('.symbol')[0].innerHTML;
                symbolGroup.push(content);
                localStorage.setItem(symbolGroup.length, content);
                savedList.innerHTML++;
            })
            // function saveObj(obj){
            //     console.log(obj);
            //     console.log('#save'+obj.Symbol)
            //     $('#save' + obj.Symbol).on("click", function() {
            //         localStorage.setItem(obj.Symbol, JSON.stringify(obj));
            //     });
            // }

            // function deleteObj(obj){
            //     console.dir(obj);
            //     $('#delete' + obj.Symbol).on("click", function() {
            //         localStorage.removeItem(obj.Symbol, JSON.stringify(obj));
            //         $('row' + obj.Symbol).remove();

            //     });
            // }
            $('.retrieveButton').click(function(){
                if(savedList.innerHTML == 0){
                    alert("You have no items in your list.  Click '+' to add");
                }else{
                    var symbol = '';
                    for(var prop in localStorage){
                        symbol += localStorage[prop] + ', ';
                    }
                    var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20("'+ symbol +'")%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';

                    $.getJSON(url, function(theDataJsFoundIfAny){
                        var stockInfo = theDataJsFoundIfAny.query.results.quote;
                        var stockCount = theDataJsFoundIfAny.query.count;
                        var newHTML = '';
                        if(stockCount > 1){
                            for(var i = 0; i < stockInfo.length; i++){
                                newHTML += buildWatchTable(stockInfo[i]);
                            }
                        }else{
                            // $('.watchlist-wrapper').removeClass('watchlist-wrapper');
                            newHTML += buildWatchTable(stockInfo);
                            
                        }
                        $('.watchlist-body').html(newHTML);
                        $('.table').DataTable();
                        $('.watch-list').css({'display':'table'});
                        $('.removeButton').click(function(){
                            for(var prop in localStorage){
                                if(localStorage[prop] === $(this).parents('tr').children('.symbol')[0].innerHTML){
                                    localStorage.removeItem(prop);
                                }
                            }
                            $(this).parents('tr').remove();
                            savedList.innerHTML--;
                        })
                    })
                }
            })
       });
    });

});



function buildNewTable(stockInfo){
    if(stockInfo.Change){
        if(stockInfo.Change[0] == '+'){
            var upDown = "success";
        }else{
            var upDown = "danger";
        }
    }
    // var stockStuff = {};
    // var htmlString = '';
    // htmlString = '<tr id="row'+stockInfo.Symbol+'"><td>' + stockInfo.Symbol + '</td>';
    // htmlString += '<td>' + stockInfo.Name + '</td>';
    // htmlString += '<td>' + stockInfo.Ask + '</td>';
    // htmlString += '<td>' + stockInfo.Bid + '</td>';
    // htmlString += '<td class="'+upDown+'">' + stockInfo.Change + '</td>';
    // htmlString += '<td>' + '<button id="save' + stockInfo.Symbol + '" class="btn btn-warning">Save</button><button type="button" id="delete' + stockInfo.Symbol + '" class="btn btn-danger">Delete</button></td></tr>';
    // stockStuff.html = htmlString;
    // stockStuff.object = stockInfo;
    // return stockStuff;
    var growingHTML = '';
    //lets get rid of the row, and then use append in the build table function
    growingHTML = '<tr><td><button type="button" class="btn btn-default saveButton">+</button></td><td class="symbol">' + stockInfo.Symbol + '</td>';
    growingHTML += '<td>' + stockInfo.Name + '</td>';
    growingHTML += '<td>' + stockInfo.Ask + '</td>';
    growingHTML += '<td>' + stockInfo.Bid + '</td>';
    growingHTML += '<td class="'+upDown+'">' + stockInfo.Change +'</td></tr>';
    return growingHTML;
};


function buildWatchTable(stockInfo){
    if(stockInfo.Change[0] == '+'){
        var upDown = "success"; 
    }else if(stockInfo.Change[0] == '-') {
        var upDown = "danger";
    }
    var growingHTML = '';
    //lets get rid of the row, and then use append in the build table function
    growingHTML = '<tr><td><button type="button" class="btn btn-default removeButton">-</button></td><td class="symbol">' + stockInfo.Symbol + '</td>';
    growingHTML += '<td>' + stockInfo.Name + '</td>';
    growingHTML += '<td>' + stockInfo.Ask + '</td>';
    growingHTML += '<td>' + stockInfo.Bid + '</td>';
    growingHTML += '<td class="'+upDown+'">' + stockInfo.Change +'</td></tr>';
    return growingHTML;
};
