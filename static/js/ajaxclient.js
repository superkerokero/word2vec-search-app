async function getImgUrl(keyword, num) {
    var myGetsy = await getsy.getsy('https://www.google.co.jp/search?hl=ja&site=imghp&tbm=isch&source=hp&biw=1680&bih=1050&q=' + keyword + '&oq=' + keyword, { corsProxy: 'https://cors-anywhere.herokuapp.com/', iframe: true });

    //console.log(myGetsy.getMe('.rg_bx.rg_di.rg_el.ivg-i')[0])
    var result = myGetsy.getMe('.rg_meta.notranslate')[num];
    var parse = JSON.parse($(result).text());
    return parse['ou'];
    //$('body').prepend('<img id="theImg" src="' + parse['ou'] + '" style="width:200px;height:200px;"/>');
};

function sendAction(pos) {
    var data = {
        "user_name": "webapp",
        "token": "test",
        "team_domain": "test",
        "channel_name": "test",
        "timestamp": "test",
        "trigger_word": "test",
        "text": pos
    };
    //var strdata = "user_name=webapp&token=test&team_domain=test&channel_name=test&timestamp=test&trigger_word=test&text=" + pos
    $.ajax({
        url: "http://localhost:8000/w2vhook",
        type: "POST",
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: "json",
        processData: false,
        success: function(data) {
            let result = data['text'];
            if (typeof(result) == 'string') {
                $("#result").html("<p style='color:orange;text-align:center;'>" + result + "</p>");
                return;
            }
            let table = makeTable(result);

            $("#result").html(table);
            let chk = $('#chkbox:checked').val();
            if (chk) {
                $("#history").append(table + "<BR>");
            };
        },
        error: function(data) { $("#result").html(data); }
    });
};

function makeTable(data) {
    let pos = $('#positive').val();
    let word = "<tr>";
    let prob = "<tr>";
    let table = "<table class=\"table table-bordered table-hover table-responsive table-striped\"><tbody>";
    let img = '<tr>';
    for (let i = 0; i < data.length; i++) {
        word += "<td>" + data[i][0] + "</td>";
        prob += "<td>" + Math.round(data[i][1] * 10000) / 10000 + "</td>";
        var imgUrl = 'static/img/loading7_orange.gif';
        img += '<td><img class="img_' + data[i][0] + '" src="' + imgUrl + '" style="max-width:100px;max-height:80px;width:auto;height:auto;"/></td>';
        getImgUrl(data[i][0], 0).then(function(value) {
            $('.img_' + data[i][0]).attr({ "src": value });
        });
    };
    table = "<p style='text-align: center;'><BR>" + pos + "</p>" + table + word + "</tr>" + prob + "</tr>" + img + "</tr>" + "</tbody></table>"
    return table
};

$('#subbtn').on('click', function(event) {
    let pos = $('#positive').val();
    sendAction(pos);
    $("#result").html("<p style='text-align: center;'>計算中...</p>");
    $('#subbtn').addClass("animated rubberBand");
    setTimeout(function() {
        $('#subbtn').removeClass("animated rubberBand");
    }, 1000)
});

//$(document).ready(function(event) {

//});