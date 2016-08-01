$(document).ready(function(){

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
                for (var i = 0; i < stockInfo.length; i++) {
                    newHTML += buildNewTable(stockInfo[i]).html;
                    $(newHTML).load(function(){
                        saveObj(stockInfo[i]);
                        deleteObj(stockInfo[i]);
                    });
                } 
            }else{
                newHTML += buildNewTable(stockInfo).html;
                $(newHTML).load(function(){
                    saveObj(stockInfo);
                    deleteObj(stockInfo);
                });
            }
            $('.yahoo-body').html(newHTML);
            $('.table').DataTable({
                buttons: [
                    {extend: 'create', editor: myEditor},
                    {extend: 'edit', editor: myEditor},
                    {extend: 'remove', editor: myEditor}
                ]
            });
       });
    });

});


function buildNewTable(stockInfo){
    if(stockInfo.Change[0] == '+'){
        var upDown = "success";
    }else{
        var upDown = "danger";
    }
    var stockStuff = {};
    var htmlString = '';
    htmlString = '<tr id="row'+stockInfo.Name+'"><td>' + stockInfo.Symbol + '</td>';
    htmlString += '<td>' + stockInfo.Name + '</td>';
    htmlString += '<td>' + stockInfo.Ask + '</td>';
    htmlString += '<td>' + stockInfo.Bid + '</td>';
    htmlString += '<td class="'+upDown+'">' + stockInfo.Change + '</td>';
    htmlString += '<td>' + '<button id="save' + stockInfo.Name + '" class="btn btn-warning">Save</button><button type="button" id="save' + stockInfo.Name + '" class="btn btn-danger">Delete</button></td></tr>';
    stockStuff.html = htmlString;
    stockStuff.object = stockInfo;
    return stockStuff;
}

function saveObj(obj){
    console.log(obj);
    $('#save' + obj.Name).on('click', function(){
        localStorage.setItem(obj.Name, JSON.stringify(obj));
    });
}

function deleteObj(obj){
    console.log(obj);
    $('#delete' + obj.Name).on('click', function(){
        $('#row' + obj.Name).remove();
        localStorage.removeItem(obj.Name);
    });
}
