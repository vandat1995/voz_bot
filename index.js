const request = require('request');
const fs = require('fs');

const url = 'https://forums.voz.vn/forumdisplay.php?s=&f=17&page=1&pp=10&sort=dateline&order=desc&daysprune=-1';
const listCookie = [
    
    'vflastvisit=1571235770; vflastactivity=0; vfforum_view=1c4e01875ace966961c421f939201cdb215382baa-1-%7Bi-17_i-1571235770_%7D; _ga=GA1.2.1475711116.1571235772; _gid=GA1.2.650690058.1571235772; __gads=ID=2174fb14698cd2fa:T=1571235771:S=ALNI_MbYkpHTWmQ7PMxDlQuT2qJAvD1Daw; vfuserid=361204; vfpassword=4e21e037bdc261b5b6e19eed657a7046; vfimloggedin=yes; vfsessionhash=6635b8cf878c73118109d893fbd23c5f; PHPSESSID=221763e9c851ddaf606cc046c41d8685'
    
    //'vflastvisit=1570796979; vflastactivity=0; vfforum_view=86506050362c924d3e2990f51a2828eb7b958a9ea-1-%7Bi-17_i-1570796979_%7D; _ga=GA1.2.1328693594.1570796981; _gid=GA1.2.904601104.1570796981; __gads=ID=7ccaca27752b2bc4:T=1570796980:S=ALNI_MYOBNE1rjK76s-gpt2AlorMAsJ74A; vfimloggedin=yes; PHPSESSID=1f1ceb249a0cb5fcf5ab1b562eb5d69d; vfthread_lastview=b16788b9a9a278bf801402e3b2b248c8da49949fa-1-%7Bi-7647006_i-1570881890_%7D; _gat_gtag_UA_351630_1=1; vfuserid=1467365; vfpassword=0a3788197a4cb3398152b957d1c75ece; vfsessionhash=00dfa3c48dc425692940f70ebcb19cc1'
];
const delay = 1000 ;// parseInt(listCookie.length);

const patternNewThreadF17 = /who\((\d+)\)([^>]+)>0/g;
const patternThreadId = /who\((\d+)\)/i;
const patternQuotePost = /p=(\d+)/i;
const patternContentQuote = /\[QUOTE=([^]+)QUOTE\]/g;
const patternTrapSex = /\[img/gi;
const patternTrapQuote = /\[quote\]/gi;
const listMod = '|amdbarton|Baby | DieHard|Banhmitrung|black jack|dangkhoa27187|DeaStyleX|Debilator|DellVietnam|Dizzy|dtieubinh|gelu567890|Ghosthammer|gthn|hddgiarevn|hoanghamobile|HoangManhHa1991|HoneyLove|IAT|KeepItReal|khanh3t|khanhvu|l0000gold|lebao|loasvhouse|Mr.Y|pear|phimhay|prescolt|pvthanh100|Spin001|tadinha|thanhvova|tlgod|Trác Đông Lai|vdz|vozExpress|vungocanh|willrock114|xxo0kid0oxx|dangkhoa27187|fRzzy|haroavatar|Kuang2|styleadmin|vtalinh|Yukumi|thuyvan|TNTANH|Vos|vozer2019|tengtengvn|Tay Siêu To|tamn|Squall|phongn|nph19|mxh19|';

const listMsgReply = [
    "Death is like the wind – always by my side.",
    "No cure for fools.",
    "People keep running into my blade.",
    "It’s just death. Nothing serious.",
    "Make it quick.",
    "Don’t start what I’ll finish.",
    "One blade, one purpose.",
    "Follow the wind, but watch your back.",
    "This blade never gets any lighter.",
    "The road to ruin is shorter than you think.",
    "Hmph. One step ahead of the past.",
    "I will not forget who I am.",
    "The more you learn, the more you know, the more you know, and the more you forget. The more you forget, the less you know. So why bother to learn.",
    "Future depends on your dreams. So go to sleep.",
    "If you give a student the base, he will fall asleep.",
    "I don’t get older. I level up.",
    "My wallet is like an onion. When I open it, I cry.",
    "It’s never too late to study; it’s only too late to use that knowledge.",
    "Don’t blame yourself. Let me do it.",
    "If each day is a gift – I’d like to know where to return Mondays."
];
const listMsgBotReply = [
    'gọi tao có chuyện gì thế mai phen :canny:',
    'gọi tao có chuyện gì thế mai phen [IMG]https://i.imgur.com/osCpCsi.png[/IMG]',
    'viettel nha [IMG]https://i.imgur.com/FY7e6U1.png[/IMG]',
    'phát card hả, viettel nhé :beauty:',
    'tính làm gì tao :canny:',
    'tính phát card hay gì :canny:, viettel nhé :beauty:',
    'viettel nhé thớt [IMG]https://i.imgur.com/JEWoIdl.png[/IMG]',
    'với tình trạng đạo đức xuống cấp như hiện nay thiếu tao là không thể :canny:'
];
const badKeywords = {
    'đm' : 'quan hệ mẫu thân',
    'đkm': 'đê ca mờ',
    'dkm': 'đê ca mờ không dấu',
    'fuck': 'f**k',
    'cặc': 'bộ phận sinh dục nam',
    'lồn': 'bộ phận sinh dục nữ',
    'loz': 'l*z',
    'địt': 'giao hợp',
    'đụ': 'giao phối',
    'đéo': 'đ*o',
    'mẹ': 'mẫu thân',
    'cứt': 'chất thải',
    'shit': 'sh*t',
};
const YASUO = {
    "exciter": {
        "pattern": /exciter/i,
        "reply": [
            "mày tính trộm chó hay gì [IMG]https://i.imgur.com/4RJD3gO.png[/IMG]",
        ],
        "title": true
    },
    "winner": {
        "pattern": /winner/i,
        "and": {
            "pattern": /mua/i,
            "title": true
        },
        "reply": [
            "mua exciter đi bạn [IMG]https://i.imgur.com/v1fmMDd.gif[/IMG]",
        ],
        "title": true
    },
    "hoi_ngu": {
        "pattern": /hỏi ngu|hoi ngu/i,
        "reply": [
            "ngu thì đừng có hỏi [IMG]https://i.imgur.com/QwJ0V0V.png[/IMG]",
            "google đi mai fen [IMG]https://i.imgur.com/Pa3C9kE.png[/IMG]",
            "có thế cũng hỏi đúng ngu thiệt [IMG]https://i.imgur.com/Q8sGcLO.png[/IMG]",
            "[IMG]https://i.imgur.com/vp47msF.jpg[/IMG]"
        ],
        "title": true
    },
    "hoi": {
        "pattern": /hỏi|hỏi về/i,
        "reply": [          
            "[IMG]https://i.imgur.com/vp47msF.jpg[/IMG]"
        ],
        "title": true
    },
    "no_sex": {
        "pattern": /no.?s.?e.?x/i,
        "reply": [
            "no sex ko phải là chuyện để mày đem ra đùa [IMG]https://i.imgur.com/JZ8i4rM.gif[/IMG",
            "no sex để mày tuỳ tiện dùng thế ak [IMG]https://i.imgur.com/8kNEyvT.png[/IMG]"
        ],
        "title": true
    },
    "co_hinh": {
        "pattern": /co.?hinh|có.?hình/i,
        "andNot": {
            "pattern": /img/i,
            "content": true
        },
        "reply": [
            "hình đâu tml [IMG]https://i.imgur.com/ghXpJrI.png[/IMG]"
        ],
        "title": true
    },
    "hoc": {
        "pattern": /học/i,
        "reply": [
            "The more you learn, the more you know, the more you know, and the more you forget. The more you forget, the less you know. So why bother to learn [IMG]https://i.imgur.com/wEqlboB.png[/IMG] "
        ],
        "title": true
    },
    "o_dau": {
        "pattern": /ở đâu/i,
        "reply": [
            "ở đâu còn lâu mới nói [IMG]https://i.imgur.com/KgmQHtR.png[/IMG]",
            "gần ngay trước mặt xa tận chân trời :badsmell:"
        ],
        "title": true
    },
    "noi_thang": {
        "pattern": /nói thẳng/i,
        "reply": [
            "nói thẳng thằng này chuyên lập thread nhảm :sogood:",
            "mày thẳng hơi nhiều rồi đấy :sogood:"
        ],
        "title": true
    },
    "tu_van": {
        "pattern": /tư vấn/i,
        "reply": [
            //"card đây rồi tư vấn [IMG]https://i.imgur.com/1BW9Wj4.png[/IMG]",
            "[IMG]https://i.imgur.com/vp47msF.jpg[/IMG]",
            "#3 tư vấn hộ [IMG]https://i.imgur.com/zFNuZTA.png[/IMG]",
            "chả biết tư vấn gì nữa [IMG]https://i.imgur.com/1BW9Wj4.png[/IMG]"
        ],
        "title": true
    },
    "thang_ban": {
        "pattern": /thằng bạn/i,
        "reply": [
            //"card đây rồi tư vấn [IMG]https://i.imgur.com/1BW9Wj4.png[/IMG]",
            "thực ra không có thằng bạn nào ở đây cả :look_down::look_down:"
        ],
        "title": true
    },
    "thit_cho": {
        "pattern": /thịt/i,
        "and": {
            "pattern": /chó/i,
            "title": true
        },
        "reply": [
            "chó là bạn [IMG]https://i.imgur.com/ltQT8F9.gif[/IMG]",
            "chó là bạn :canny:",
            "đã báo hội chó quyền [IMG]https://i.imgur.com/QwJ0V0V.png[/IMG]"
        ],
        "title": true
    }, 
    "thit_cho2": {
        "pattern": /thịt/i,
        "and": {
            "pattern": /chó/i,
            "content": true
        },
        "reply": [
            "chó là bạn [IMG]https://i.imgur.com/ltQT8F9.gif[/IMG]",
            "chó là bạn :canny:",
            "đã báo hội chó quyền [IMG]https://i.imgur.com/QwJ0V0V.png[/IMG]"
        ],
        "content": true
    },
    "xin_card": {
        "pattern": /c.?a.?r.?d|thẻ|phát.?card/i,
        "andNot": {
            "pattern": /s.?h.?i.?t|c.?ứ.?t/i,
            "title": true,
            "content": true
        },
        "reply": [
            "viettel nhé thớt [IMG]https://i.imgur.com/Q8sGcLO.png[/IMG]",
            "mình viettel nhé [IMG]https://i.imgur.com/0YmFIEk.gif[/IMG]",
            "mình sài viettel :badsmell:"
        ],
        "title": true
    },
    "xin_card2": {
        "pattern": /c.?a.?r.?d|thẻ|phát.?card/i,
        "andNot": {
            "pattern": /s.?h.?i.?t|c.?ứ.?t/i,
            "title": true,
            "content": true
        },
        "reply": [
            "viettel nhé thớt [IMG]https://i.imgur.com/Q8sGcLO.png[/IMG]",
            "mình viettel nhé [IMG]https://i.imgur.com/0YmFIEk.gif[/IMG]",
            "mình sài viettel :badsmell:"
        ],
        "content": true
    },
    "test_bot": {
        "pattern": /b.?o.?t|b.?0.?t/i,
        "and": {
            "pattern": /t.?e.?s.?t|t.?3.?s.?t/i,
            "title": true
        },
        "reply": [
            //"muốn test thì nổ card viettel vào in bóc trước nhé [IMG]https://i.imgur.com/TWtHg3c.gif[/IMG]",
            "test xong có phát card không :canny:",
            "test lằm test lốn :what:",
            "card trước test sau :what::baffle:",
            "tao không phải là trò để bọn mày test [IMG]https://i.imgur.com/KgmQHtR.png[/IMG]",
            "làm ơn đừng test tao nữa [IMG]https://i.imgur.com/4gmOAMB.png[/IMG]",
            "tao không phải là trò để bọn mày test :angry:",
            "đây không phải là trò đùa :angry:"
        ],
        "title": true
    },
    "bot_ngu": {
        "pattern": /b.?o.?t|b.?0.?t/i,
        "and": {
            "pattern": /n.?g.?u/i,
            "title": true
        },
        "reply": [
            "mày ngu thì có [IMG]https://i.imgur.com/lhuVlcm.png[/IMG]",
            "con chóa này [IMG]https://i.imgur.com/1BW9Wj4.png[/IMG]",
            "coi chừng tao [IMG]https://i.imgur.com/KgmQHtR.png[/IMG]"
        ],
        "title": true
    },
    "bot_ngu2": {
        "pattern": /b.?o.?t|b.?0.?t/i,
        "and": {
            "pattern": /n.?g.?u/i,
            "content": true
        },
        "reply": [
            "mày ngu thì có [IMG]https://i.imgur.com/lhuVlcm.png[/IMG]",
            "con chóa này [IMG]https://i.imgur.com/1BW9Wj4.png[/IMG]",
            "coi chừng tao [IMG]https://i.imgur.com/KgmQHtR.png[/IMG]"
        ],
        "content": true
    },
    "bot_shit": {
        "pattern": /b.?o.?t|b.?0.?t/i,
        "and": {
            "pattern": /s.?h.?i.?t|c.?ứ.?t/i,
            "content": true
        },
        "reply": [
            "con chóa này [IMG]https://i.imgur.com/1BW9Wj4.png[/IMG]",
            "coi chừng tao [IMG]https://i.imgur.com/KgmQHtR.png[/IMG]",
            "ăn nói như thằng vô học vậy [IMG]https://i.imgur.com/4RJD3gO.png[/IMG][IMG]https://i.imgur.com/KgmQHtR.png[/IMG]"
        ],
        "content": true
    },
    "bot_shit2": {
        "pattern": /b.?o.?t|b.?0.?t/i,
        "and": {
            "pattern": /s.?h.?i.?t|c.?ứ.?t/i,
            "title": true
        },
        "reply": [
            "con chóa này [IMG]https://i.imgur.com/1BW9Wj4.png[/IMG]",
            "ăn nói như thằng vô học vậy [IMG]https://i.imgur.com/4RJD3gO.png[/IMG][IMG]https://i.imgur.com/KgmQHtR.png[/IMG]",
            "coi chừng tao [IMG]https://i.imgur.com/KgmQHtR.png[/IMG]"
        ],
        "title": true
    },
    "bot": {
        "pattern": /b.?o.?t|b.?0.?t/i,
        "reply": [
            "gọi tao có chuyện gì thế mai fen :canny:",
            "gọi tao có chuyện gì thế mai phen [IMG]https://i.imgur.com/osCpCsi.png[/IMG]",
            "viettel nha [IMG]https://i.imgur.com/FY7e6U1.png[/IMG]",
            "phát card hả, viettel nhé :beauty:",
            "tính làm gì tao :canny:",
            "tính phát card hay gì :canny:, viettel nhé :beauty:",
            "viettel nhé thớt [IMG]https://i.imgur.com/JEWoIdl.png[/IMG]",
            "với tình trạng đạo đức xuống cấp như hiện nay thiếu tao là không thể :canny:",
            "mày đang giấu cái gì đó :shame:",
            "mày post nhảm hơi nhiều rồi đấy [IMG]https://i.imgur.com/KgmQHtR.png[/IMG]"
        ],
        "title": true
    },
}
const keyWords = {
    'exciter': /exciter/i,
    'winner': /winner/i,
    'card': /c.?a.?r.?d|thẻ/i,
    'shit': /s.?h.?i.?t|c.?ứ.?t/i,
    'bot': /b.?o.?t|b.?0.?t/i,
    'ngu': /ngu/i,
    'test': /test/i,
    'cohinh': /co.?hinh|có.?hình/i
}

let currUser = 0;
init();

async function init() {
    logger(`[_START_PROCESS_____________________________________________]`);
    let headerGet = getHeader(currUser);
    let botIdGet = getUserIdOfCookie(headerGet['cookie']); 
    try {
        let body = await HttpRequest(url, { method: 'GET', headers: headerGet });
        let matches = body.match(patternNewThreadF17);
        if (!matches || matches.length < 1) {
            logger(`[[BOT_ID][${botIdGet}]] => [NOT_FOUND_NEW_THREAD]`);
            return;
        }
        logger(`[[BOT_ID][${botIdGet}]] => [FOUND_${matches.length}_THREAD]`);
        for (let i = 0; i < matches.length; i++) {
            let header = getHeader(currUser);
            let botId = getUserIdOfCookie(header['cookie']);
            try {
                let sign = getSignBot(botId);
                let m1 = matches[i].match(patternThreadId);
                if (!m1 || m1.length < 2) {
                    logger(`[[BOT_ID][${botId}] => [[NOT_FOUND][threadId]] [${matches[i]}]`);
                    continue;
                }
                let threadId = m1[1];
                let urlNewThread = `https://forums.voz.vn/showthread.php?t=${threadId}`;
                logger(`[[BOT_ID][${botId}]] => [${urlNewThread}] [NEW_THREAD]`);
                let htmlThread = await HttpRequest(urlNewThread, { method: 'GET', headers: header, followAllRedirects: true });
                let userName = getUsername(htmlThread);
                if (listMod.includes(`|${userName}|`)) {
                    logger(`[[BOT_ID][${botId}]] => [${urlNewThread}] [[NICK_MOD][${userName}]]`);
                    continue;
                }
                let m2 = htmlThread.match(patternQuotePost);
                if (!m2 || m2.length < 2) {
                    logger(`[[BOT_ID][${botId}]] => [${urlNewThread}] [[NOT_FOUND][quoteId]]`);
                    continue;
                }
                let quoteId = m2[1];
                let urlQuote = `https://forums.voz.vn/newreply.php?do=newreply&p=${quoteId}`;
                let htmlQuote = await HttpRequest(urlQuote, { method: 'GET', headers: header, followAllRedirects: true });
                let m3 = htmlQuote.match(patternContentQuote);
                if (!m3 || m3.length < 1) {
                    logger(`[[BOT_ID][${botId}]] => [${urlNewThread}] [[NOT_FOUND][htmlQuote]]`);
                    continue;
                }
                
                let title = getTitle(htmlQuote);
                logger(`[[BOT_ID][${botId}]] => [[THREAD_TITLE][${title}]]`);
                let msgReply = '';
                
                let mTrap = m3[0].match(patternTrapSex);
                let mTrap2 = m3[0].match(patternTrapQuote);
                if (mTrap && mTrap.length > 10) {
                    m3[0] = '';
                    msgReply = 'Hình như trap tốt nhất không quote [IMG]https://i.imgur.com/V092S5K.gif[/IMG]';
                } else if (mTrap2 && mTrap2.length > 2) {
                    m3[0] = '[QUOTE]Gâu gâu...[/QUOTE]';
                    msgReply = 'Tính trap quote bố m chứ gì [IMG]https://i.imgur.com/KgmQHtR.png[/IMG]';
                } else if (m3[0].length > 20000) {
                    m3[0] = '[QUOTE]Gâu gâu...[/QUOTE]';
                    msgReply = 'Thằng L*N post bài dài vậy [IMG]https://i.imgur.com/EB2RUU6.gif[/IMG]';
                } else if (userName == 'phitungson') {
                    m3[0] = '[QUOTE]Gâu gâu...[/QUOTE]';
                    msgReply = 'thằng chó này chuyên post s*x rồi edit mod vào ban chết cụ nó đi :look_down:';
                } else {
                    msgReply = detectContentV2(title, m3[0]) || msgReply || listMsgReply[Math.floor(Math.random() * listMsgReply.length)];
                }
                
                for (let [key, val] of Object.entries(badKeywords)) {
                    let rg = new RegExp(key, 'gi');
                    title = title.replace(rg, val);
                    m3[0] = m3[0].replace(rg, val);
                }               
                let msg = `${m3[0]}${msgReply}\n${await getLatestThread(htmlThread, userName, header, botId)}\n${sign}`;
                logger(`[[BOT_ID][${botId}]] => [[MSG_REPLY][${msgReply}]]`);
                let urlReply = `https://forums.voz.vn/newreply.php?do=postreply&t=${threadId}`;
                let form = {
                    'wysiwyg': '0',
                    's': '',
                    'multiquoteempty': '',
                    'do': 'postreply',
                    'sbutton': 'Submit Reply',
                    'parseurl': '1',
                    'emailupdate': '9999',
                    'rating': '0',
                    'specifiedpost': '1',
                    'poststarttime': getCurrentUnixTime(),
                    'posthash': getPosthash(htmlQuote),
                    'loggedinuser': botId,
                    'p': quoteId,
                    't': threadId,
                    'securitytoken': getSecuritytoken(htmlQuote),
                    'message': msg.replace(/&amp;quot;/g, '"').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&gt;/g, '>'),
                    'title': title.replace(/&amp;quot;/g, '"').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&gt;/g, '>'),
                };
                await HttpRequest(urlReply, {
                    method: 'POST',
                    headers: header,
                    form: form
                });
                logger(`[[BOT_ID][${botId}]] => [${urlNewThread}] [GERMANY]`);                
            } catch (e) {
                logger(`[[BOT_ID][${botId}] => [ERROR][QUOTE] [${e.toString()}]`);
            } finally {
                currUser++;
                if (currUser == listCookie.length) {
                    currUser = 0;
                    break;
                }
            }
        }
    } catch (e1) {
        logger(`[[BOT_ID][${botIdGet}]] => [ERROR][PROCESS] [${e1.message}]`);
    } finally {
        logger(`[_END_PROCESS_______________________________________________]`);
        await sleep(delay);
        init();
    }
}


function detectContent(title, content) {
    let temp1 = title.toLowerCase().replace(/\./g, '');
    let temp2 = content.toLowerCase().replace(/\./g, '');
    if (/no sex/i.test(temp1)) {
        return 'no sex ko phải là chuyện để mày đem ra đùa [IMG]https://i.imgur.com/JZ8i4rM.gif[/IMG]';
    }
    if (/hỏi ngu/i.test(temp1)) {
        return 'ngu thì đừng có hỏi [IMG]https://i.imgur.com/QwJ0V0V.png[/IMG]';
    }
    if ((keyWords['bot'].test(temp1) || keyWords['bot'].test(temp2)) && (keyWords['ngu'].test(temp1) || keyWords['ngu'].test(temp2))) {
        return 'mày ngu thì có [IMG]https://i.imgur.com/lhuVlcm.png[/IMG]';
    }
    if ((keyWords['bot'].test(temp1)) && (keyWords['shit'].test(temp2))) {
        return 'ăn nói cho đàng hoàng vào [IMG]https://i.imgur.com/M5piBDe.gif[/IMG]';
    }
    if (keyWords['bot'].test(temp1) && keyWords['test'].test(temp1) && !keyWords['shit'].test(temp2)) {
        return 'muốn test thì nổ card viettel vào in bóc trước nhé [IMG]https://i.imgur.com/TWtHg3c.gif[/IMG]';
    }
    if (keyWords['cohinh'].test(temp1)) {
        if (!/img/i.test(temp2)) {
            logger(temp2);
            return 'hình đâu tml [IMG]https://i.imgur.com/ghXpJrI.png[/IMG]';
        }
    }
    if (/ở đâu/i.test(temp1)) {
        return 'ở đâu còn lâu mới nói [IMG]https://i.imgur.com/KgmQHtR.png[/IMG]';
    }
    if (/nói thẳng/i.test(temp1)) {
        return 'Nói thẳng thằng này chuyên lập thread nhảm :sogood:';
    }
    if (/tư vấn/i.test(temp1)) {
        return 'card viettel đây rồi tư vấn [IMG]https://i.imgur.com/1BW9Wj4.png[/IMG]';
    }
    if (keyWords['exciter'].test(temp1) || keyWords['exciter'].test(temp2)) {
        return 'mày tính trộm chó hay gì [IMG]https://i.imgur.com/4RJD3gO.png[/IMG]';
    }
    if (/mua/i.test(temp1) && keyWords['winner'].test(temp1)) {
        return 'mua exciter đi bạn [IMG]https://i.imgur.com/v1fmMDd.gif[/IMG]';
    }
    if ((temp1.includes("thịt") && temp1.includes("chó")) || (temp2.includes("thịt") && temp2.includes("chó"))) {
        return 'chó là bạn [IMG]https://i.imgur.com/ltQT8F9.gif[/IMG]';
    }
    if (keyWords['card'].test(temp1) && !keyWords['shit'].test(temp1) && !keyWords['shit'].test(temp2)) {
        return 'viettel nhé thớt [IMG]https://i.imgur.com/Q8sGcLO.png[/IMG]';
    }
    return false;
}
function detectContentV2(title, content) {
    title = title.toLowerCase().replace(/\.| +\./g, '');
    content = content.toLowerCase().replace(/\.| +\./g, '');
    for (let [key, val] of Object.entries(YASUO)) {
        if (val['title'] && val['content'] && val['pattern'].test(title) && val['pattern'].test(content)) {
            if (val['and']) {
                if (val['and']['title'] && val['and']['content'] && val['and']['pattern'].test(title) && val['and']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (val['and']['title'] && !val['and']['content'] && val['and']['pattern'].test(title)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (!val['and']['title'] && val['and']['content'] && val['and']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
            } else if (val['andNot']) {
                if (val['andNot']['title'] && val['andNot']['content'] && !val['andNot']['pattern'].test(title) && !val['andNot']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (val['andNot']['title'] && !val['andNot']['content'] && !val['andNot']['pattern'].test(title)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (!val['andNot']['title'] && val['andNot']['content'] && !val['andNot']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
            } else {
                return val['reply'][Math.floor(Math.random() * val['reply'].length)];
            }      
        }
        if (val['title'] && !val['content'] && val['pattern'].test(title)) {
            if (val['and']) {
                if (val['and']['title'] && val['and']['content'] && val['and']['pattern'].test(title) && val['and']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (val['and']['title'] && !val['and']['content'] && val['and']['pattern'].test(title)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (!val['and']['title'] && val['and']['content'] && val['and']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
            } else if (val['andNot']) {
                if (val['andNot']['title'] && val['andNot']['content'] && !val['andNot']['pattern'].test(title) && !val['andNot']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (val['andNot']['title'] && !val['andNot']['content'] && !val['andNot']['pattern'].test(title)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (!val['andNot']['title'] && val['andNot']['content'] && !val['andNot']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
            } else {
                return val['reply'][Math.floor(Math.random() * val['reply'].length)];
            }
            
        }
        if (!val['title'] && val['content'] && val['pattern'].test(content)) {
            if (val['and']) {
                if (val['and']['title'] && val['and']['content'] && val['and']['pattern'].test(title) && val['and']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (val['and']['title'] && !val['and']['content'] && val['and']['pattern'].test(title)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (!val['and']['title'] && val['and']['content'] && val['and']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
            } else if (val['andNot']) {
                if (val['andNot']['title'] && val['andNot']['content'] && !val['andNot']['pattern'].test(title) && !val['andNot']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (val['andNot']['title'] && !val['andNot']['content'] && !val['andNot']['pattern'].test(title)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
                if (!val['andNot']['title'] && val['andNot']['content'] && !val['andNot']['pattern'].test(content)) {
                    return val['reply'][Math.floor(Math.random() * val['reply'].length)];
                }
            } else {
                return val['reply'][Math.floor(Math.random() * val['reply'].length)];
            }
        }
    }
    return '';
}

async function getLatestThread(htmlThread, userName, header, botId) {
    let userId = getUserId(htmlThread);
    if (!userId) {
        logger(`[[BOT_ID][${botId}]] => [[NOT_FOUND][userId]]`);
        return '';
    }
    let urlUserProfile = `https://forums.voz.vn/search.php?do=finduser&u=${userId}&starteronly=1`;
    let html = await HttpRequest(urlUserProfile, { method: 'GET', headers: header, followAllRedirects: true });
    let listThreadTitle = html.match(/href="showthread.php(.+)thread_title([^>]+)>([^<]+)/g);
    let latestThreads = '';
    if (!listThreadTitle || listThreadTitle.length < 1) {
        logger(`[[BOT_ID][${botId}]] => [[NOT_FOUND][LATEST_THREAD]] [${userId}]`);
        latestThreads = '[I]Thằng này nó nằm vùng kín quá có mỗi thread này hoặc bot đang đói không tìm thấy thread.[/I]';
    } else {
        let limit = listThreadTitle.length > 10 ? 10 : listThreadTitle.length;
        for (let i = 0; i < limit; i++) {
            latestThreads += `- ${getThreadTitle(listThreadTitle[i])}\n`;
        }
        latestThreads = `\n[COLOR="Red"][I]${limit} thread nhảm gần đây của [B]${userName}[/B]:[/I][/COLOR]\n` + latestThreads;
    }
    return `${latestThreads}\n[B][I][URL="https://forums.voz.vn/profile.php?do=addlist&userlist=ignore&u=${userId}"]Ignore [COLOR="Red"]${userName}[/COLOR] :sexy:[/URL][/I][/B]`;
}
function getUserId(html) {
    let m = html.match(/bigusername".href="member\.php\?u=([^"]+)/i);
    if (!m || m.length < 2) {
        return '';
    }
    return m[1];
}
function getUsername(html) {
    let m = html.match(/"bigusername"([^>]+)>([^<]+)/i);
    if (!m || m.length < 3) {
        return '';
    }
    return m[2];
}
function getThreadTitle(html) {
    let m = html.match(/thread_title([^>]+)>([^<]+)/i);
    let m2 = html.match(/href="([^"]+)/i);
    if (!m || !m2 || m2.length < 2 || m.length < 3) {
        return '';
    }
    return `[URL="https://forums.voz.vn/${m2[1]}"]${m[2].trim()}[/URL]`;
}
function getLastPostTime(html) {
    let m = html.match(/(\d{2}-\d{2}-\d{4}).<span class="time">(\d{2}:\d{2})/i);
    if (!m || m.length < 3) {
        return '';
    }
    return `Last Post: ${m[2].trim()} ${m[1].trim()}`;
}

function getUserIdOfCookie(cookie) {
    let m = cookie.match(/vfuserid=([^;]+)/i);
    if (!m || m.length < 2) {
        return '';
    }
    return m[1];
}
function getSignBot(botId) {
    return `[SIZE="1"][I][URL="https://forums.voz.vn/profile.php?do=addlist&userlist=ignore&u=${botId}"]Ignore bot[/URL][/I]\n[I][B]Sent from Voz.OS 6.9[/B][/I]\n________________________[/SIZE]\n[B][I]Resource of Messii[/B][/I]`;
}
function getHeader(index) {
    return {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
        'cookie': listCookie[index],
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,es;q=0.4',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

/**
* Common function get form data
*/
function getSecuritytoken(html) {
    let m = html.match(/"securitytoken" value="([^"]+)/i);
    if (!m || m.length < 2) {
        return '';
    }
    return m[1];
}
function getTitle(html) {
    let m = html.match(/"title" value="([^"]+)/i);
    if (!m || m.length < 2) {
        return '';
    }
    return m[1];
}
function getPosthash(html) {
    let m = html.match(/posthash" value="([^"]+)/i);
    if (!m || m.length < 2) {
        return '';
    }
    return m[1];
}
function getCurrentUnixTime() {
    return (new Date().getTime() / 1000).toFixed(0);
}

/**
* Common function
*/
function logger(msg) {
    let date = new Date();
    console.log(`${date.toLocaleString()} - ${msg}`);
    fs.appendFileSync('./log.txt', `${date.toLocaleString()} - ${msg}\n`);
}
function HttpRequest(url, option, body = '') {
    return new Promise((resolve, reject) => {
        request(url, option, (error, res, body) => {
            if (error) {
                return reject(error);
            }
            if (res.statusCode < 200 || res.statusCode > 399) {
                return reject(body);
            }
            return resolve(body);
        });
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(() => { return resolve(); }, ms));
}

