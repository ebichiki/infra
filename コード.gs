var LINE_NOTIFY_TOKEN = ""; //取得したアクセストークン
var LINE_NOTIFY_API = "https://notify-api.line.me/api/notify";
var INFRA_CALENDER = "https://wp.infra-workshop.tech/events/";

function sendInfraSchedule() {
  var today = new Date();
  var targetYMD = today.getYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2); //YYYY-MM-DD形式
  var bodyItem = ["-本日のインフラ勉強会-"];
  var targetURL = INFRA_CALENDER + targetYMD;
  
  var searchTagTitle = "<h3 class=\"tribe-events-list-event-title summary\">";
  var searchTagTitleStart = " rel=\"bookmark\">";
  var searchTagA = "\t</a>";
  var searchTagDateStart = "<span class=\"tribe-event-date-start\">";
  var searchTagDateEnd = "\t</div>";
  
  var response = UrlFetchApp.fetch(targetURL);
  var html = response.getContentText("UTF-8");
  
  //タイトルの個数取得
  var num = html.split(searchTagTitle).length - 1;
  
  var index = 0;
  
  for (var i = 0; i < num; i++) {
    //タイトルの取得
    index = html.indexOf(searchTagTitle);
    if (index !== -1) {
      html = html.substring(index + searchTagTitle.length);
      index = html.indexOf(searchTagTitleStart);
      if (index !== -1) {
        html = html.substring(index + searchTagTitleStart.length);
        index = html.indexOf(searchTagA);
        var title = "";
        if (index !== 1) {
          title = html.substring(0, index).trim();
        }
      }
    }
    
    //開始時刻の取得
    index = html.indexOf(searchTagDateStart);
    if (index !== -1) {
      html = html.substring(index + searchTagDateStart.length);
      index = html.indexOf(searchTagDateEnd);
      var date = "";
      if (index !== -1) {
        //タグを削除した状態の時刻を抽出
        date = html.substring(0, index).trim().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,"");
      }
    }
    bodyItem.push(date + " > " + title);
  }
  if (bodyItem.length == 1) {
    bodyItem.push("今日の予定はありません。");
  }
  _sendMessage(bodyItem.join("\n"));
}

function _sendMessage(msg) {
  //認証情報のセット
  var headers = {
    "Authorization": "Bearer " + LINE_NOTIFY_TOKEN
  };
  
  //メッセージをセット
  var payload = {
    "message": msg
  };
  
  //送信情報をまとめる
  var options = {
    'method' : 'post',
    'contentType' : 'application/x-www-form-urlencoded',
    'headers': headers,
    'payload' : payload
  };
  Logger.log(options);
  //実際に送信する
  var response = UrlFetchApp.fetch(LINE_NOTIFY_API, options);
  Logger.log(response);
}
