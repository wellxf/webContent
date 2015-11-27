/**
 * 
 */

device.debug = 0;  
        //Could be on,off,unknown
        switchCurrentState = "on";
        waitingMessaegReplyID = 500010;
        sendMessageInCookie = "";
        alreadySendCancelGuideMessage = false;
        totalMessageSizeInCookie = 5;
        isIOS = 0;
    	cookieKey = "wa-ou-sent-message";
        
	    preDefinedMessages = ["半小时后关灯","10点关灯","晚上6点到8点开灯","明早5点开灯","每天6点到7点开灯",""];
	    
	    allDetailedTestMessages = ["打开呼吸灯","关闭呼吸灯","1分后关灯", "23点到1点开灯", "11点到1点开灯", "8:20开灯", "8：20开灯", "8点20开灯", "8点20分开灯", "上午8点20开灯", "下午8点20开灯","晚上8点20开灯", 
	                               "12点半关灯","5点半关灯","五点半关灯","21点半关灯","9点半关灯",
	                               "晚上6点23分到8点27分开灯","晚上6点到8点27分开灯","晚上6点到8点五十七分开灯",
	                               "晚上6点到十点五十七开灯","二十点半到零点五十七开灯","12：30到12：50关灯",
	                               "12:30到12:50关灯","后天晚上9点到11点半开灯","八十八分钟后关灯", "八十分钟后关灯","半小时后关灯","一个半小时后关灯",
	                               "两个半小时后关灯","三个半小时后关灯","一小时50分钟后开灯","一小时一分钟后开灯","明早5点开灯",
	                               "明早5点三十分开灯","每天6点到7点开灯","每天6点20到7点50开灯","五点整开灯","晚上六点钟到8点钟开灯",
	                               "后天晚上六点钟到8点钟开灯","每天晚上六点钟到8点钟开灯"]
        
	    function clickLine(obj) {
            document.getElementById("inputTextBox").value = obj;
            document.getElementById( "sendButton" ).removeAttribute("disabled");
        }
        
        function setInputTextBoxValueAccordingtoSelect(obj) {
            obj.nextElementSibling.value = obj.value;
            inputTextChange();
        }
        
        function setInputTextBoxValueToFirstValue(obj) {
            if ( obj.nextElementSibling.value == "" ) {
                obj.nextElementSibling.value = obj.value;
                inputTextChange();
            } 
        }
        
        function inputFieldOnClick() {
            var obj = document.getElementById("inputTextBox");
            if ( obj.value.length == 0 ) {
                var o = document.getElementById("inputTextSelect");
                var event;
                event = document.createEvent('MouseEvents');
                event.initMouseEvent('mousedown', true, true, window);
                o.dispatchEvent(event);
            }
        }
        
        function inputTextChange() {
            var obj = document.getElementById( "inputTextBox" );
            if ( obj.value != "" ) {
                document.getElementById( "sendButton" ).removeAttribute("disabled");
            } else {
                document.getElementById( "sendButton" ).disabled = "disabled";
            }
        }
        
        function send500001Message( v ) {
        	var o=document.getElementById("switchButton");
            var toSendId = 500001;
            waitingMessaegReplyID = toSendId;
            device.send({
                datapoint: [{
                    id: toSendId,
                    apiName: 'set_data_point',
                    type: 'int32',
                    value: v
                }],
                vibrate: 1,
                onSuccess: function(ret) {
                	device.log('onSuccess: ' + JSON.stringify(ret));
                },
                onError: function(ret) {
                    device.log('onError: ' + JSON.stringify(ret));
                    if ( ret['msg'].indexOf( "频率" ) > 0 ) {
                    	pushMessageIntoHeadPanel( "receiver", "您点得太快了哦，慢一点～" );
                    }
                }
            });
        }
        
        function clickSwitchButton() {            
            send500001Message( -1 );
        }
        
        function pushMessageIntoHeadPanel( type, value ) {
             var head = document.getElementById("head");  
             if ( type == "sender" ) {
                 head.appendChild( createSender(value) );    
             } else if ( type == "receiver"){
                 head.appendChild( createReceiver(value) );
             }
             
             head.scrollTop = head.scrollHeight;
        }
        
        function isNum(s)
        {
            if (s!=null && s!="")
            {
                return !isNaN(s);
            }
            return false;
        }
        
        function changeTenToNumber( num ) {
            if (num == "半") {num = 0.5;} else if (num == "零") {num = 0;} else if (num == "一") {num = 1;} 
            else if (num == "两") {num = 2;}else if (num == "二") {num = 2;} 
            else if (num == "三") {num = 3;} else if (num == "四") {num = 4;} else if (num == "五") {num = 5;} 
            else if (num == "六") {num = 6;} else if (num == "七") {num = 7;} else if (num == "八") {num = 8;} 
            else if (num == "九") {num = 9;} else if (num == "十") {num = 10;} else { 
                num = -1;               
            }
            
            return num;
        }
        function changeChineseToNumber( time ) {
            
            if ( isNum( time ) ) {
                return Number(time);
            }
            
            if (time == "半") {
                time = 0.5;
            } else {
                var c1 = 0;
                var c2 = 10;
                var c3 = 0;
                if ( time.length >= 3 ) {
                    c1 = changeTenToNumber( time.charAt(0) );   
                    c3 = changeTenToNumber( time.charAt(2) );  
                }  else if ( time.length == 2 ) {
                    //二十 或十一
                    c1 = changeTenToNumber( time.charAt(0) );  
                    c3 = changeTenToNumber( time.charAt(1) );
                    if ( c1 == 10 ) {
                    	c1 = 1;
                    }
                    if ( c3 == 10 ) {
                        c3 = 0;
                    }
                } else if ( time.length >= 1 ) {
                    c3 = changeTenToNumber( time.charAt(0) );             
                }
                
                time = c1 * c2 + c3;                
            }
            
            return time;
        }
        
        function beautyMinutes( minute ) {
            if ( minute == 0 ) {
                return "00";
            } else {
                return minute.toString();
            }
        }
        function printDeviceLogFor500003( currentYear, currentMonth, currentDate, currentHour,currentMinute,currentSecond,timeBeginHour,timeBeginMinute,timeEndHour,timeEndMinute,repeatTime,state,startDayCount ) {
            var deviceLog = "现在时间（20" + currentYear.toString() + "年" + currentMonth.toString() + "月" + currentDate + "日 " + 
               currentHour.toString() + ":" + beautyMinutes( currentMinute ) + ":" + beautyMinutes( currentSecond ) + ") " ;

            if ( state == 1 ) {
                deviceLog = deviceLog + "开灯时间（" +　timeBeginHour.toString()　+　":" + beautyMinutes( timeBeginMinute ) + ") ";
                if ( timeEndHour != 0xFF ) {
                    deviceLog = deviceLog + "关灯时间（" +　timeEndHour.toString()　+　":" + beautyMinutes( timeEndMinute ) + ") ";
                }
            } else {
                deviceLog = deviceLog + "关灯时间（" +　timeBeginHour.toString()　+　":" + beautyMinutes( timeBeginMinute ) + ") ";
                if ( timeEndHour != 0xFF ) {
                    deviceLog = deviceLog + "开灯时间（" +　timeEndHour.toString()　+　":" + beautyMinutes( timeEndMinute ) + ") ";
                }
            }
            
            if ( repeatTime == 0xFF ) {
                deviceLog = deviceLog + " 重复次数: -1 (表示无限)";
            } else {
                deviceLog = deviceLog + " 重复次数: " + repeatTime.toString();
            }
            
            if ( startDayCount == 1 ) {
                deviceLog = deviceLog + " 从明天开始";
            } else if ( startDayCount == 2 ) {
                deviceLog = deviceLog + " 从后天开始";
            } else if ( startDayCount != 0 ) {
                deviceLog = deviceLog + " 从第" + startDayCount + "天开始";
            }
            device.log( deviceLog );
        }
        
        
        function sendDelayMessage( value ) {
            value = value.replace( "个小时", "小时" );
            value = value.replace( "个半小时", "小时30分钟" );
            value = value.replace( "分后", "分钟后" );
            var pos = value.indexOf( "小时" );
            
            var myDate = new Date();
            var currentYear = myDate.getFullYear() - 2000;
            var currentMonth = myDate.getMonth() + 1;
            var currentDate = myDate.getDate();
            
            var currentHour = myDate.getHours();
            var currentMinute = myDate.getMinutes();
            var currentSecond = myDate.getSeconds();
            
            var timeBeginHour = 0;
            var timeBeginMinute = 0;
            var timeEndHour = 0xFF;
            var timeEndMinute = 0xFF;
            var repeatTime = 1;
            var startDayCount = 0;
            
            if ( pos > 0 ) {
                timeBeginHour = value.substring( 0, pos );
                timeBeginHour = changeChineseToNumber( timeBeginHour );             
            } 

            var minutePos = value.indexOf( "分钟" );
            if ( minutePos > 0 ) {
                if ( pos > 0 ) {
                    timeBeginMinute = value.substring( pos + 2, minutePos );
                } else {
                    //这是一分钟后关灯的情况
                    timeBeginMinute = value.substring( 0, minutePos );
                }
                timeBeginMinute = changeChineseToNumber( timeBeginMinute );
                if ( timeBeginMinute > 0 && timeBeginMinute < 1 ) {
                	timeBeginMinute = 0;
                }
            }
            
            if ( timeBeginHour < 0 || timeBeginMinute < 0 || ( timeBeginHour + timeBeginMinute == 0 ) ) {
                
            	if ( value.indexOf( "秒" ) >= 0 || value.indexOf( "半分钟") >= 0 ) {
                	setTimeout( pushMessageIntoHeadPanel, 500, "receiver", "对不住，我不能支持秒表" );
                } else {
                	setTimeout( pushMessageIntoHeadPanel, 500, "receiver", "您设置的时间太深奥，我理解不了" );
                }            	    
                return;
            }
            
            timeBeginMinute = timeBeginMinute + (timeBeginHour % 1) * 60;
            timeBeginHour = parseInt( timeBeginHour );
            
            timeBeginMinute = timeBeginMinute + currentMinute;
            if ( timeBeginMinute >= 60 ) {
                timeBeginHour  = timeBeginHour + parseInt( timeBeginMinute/60 );
                timeBeginMinute = timeBeginMinute%60;
            }
            
            timeBeginHour = timeBeginHour + currentHour;

            if ( timeBeginHour >= 24 ) {
                startDayCount = startDayCount + parseInt( timeBeginHour/24 );
                
                if ( startDayCount > 2 ) {
                	setTimeout( pushMessageIntoHeadPanel, 100, "receiver", "这都是" + startDayCount + "天后的事了，到那个时候再告诉我吧^_^" );    
                    return;
                }
                timeBeginHour = timeBeginHour % 24;
            }
            
            var state = 0;
            if ( value.indexOf( "开" ) > 0 ) {
                state = 1;
            }
            
            printDeviceLogFor500003( currentYear&0xFF, currentMonth&0xFF, currentDate&0xFF, currentHour&0xFF, currentMinute&0xFF, currentSecond&0xFF, timeBeginHour&0xFF,timeBeginMinute&0xFF,timeEndHour&0xFF,timeEndMinute&0xFF,repeatTime&0xFF,state&0xFF, startDayCount&0xFF );

            var toSendId = 500003;
            waitingMessaegReplyID = toSendId;
            device.send({
                datapoint: [{
                    id: toSendId,
                    apiName: 'set_data_point',
                    type: 'bytearray',
                    value: [currentYear&0xFF, currentMonth&0xFF, currentDate&0xFF,currentHour&0xFF,currentMinute&0xFF,currentSecond&0xFF, timeBeginHour&0xFF,timeBeginMinute&0xFF,timeEndHour&0xFF,timeEndMinute&0xFF,repeatTime&0xFF,state&0xFF,startDayCount&0xFF]
                }],
                vibrate: 1,
                onSuccess: function(ret) {
                    device.log('on_time_switch onSuccess: ');
                    if ( !isIOS ) {
                        pushMessageIntoHeadPanel( "receiver", "收到!" );
                    }
                },
                onError: function(ret) {
                    device.log('onError: ' + JSON.stringify(ret));
                }
            });
            
        }
        
        function sendBreathLightMessage( value ) {
            var posTimeStringEnd = value.indexOf( "开" );
            var state = 1;
            if ( posTimeStringEnd < 0 ) {
                state = 0;
            }
            var toSendId = 500004;
            waitingMessaegReplyID = toSendId;
            device.send({
                datapoint: [{
                    id: toSendId,
                    apiName: 'set_data_point',
                    type: 'int32',
                    value: state
                }],
                vibrate: 1,
                onSuccess: function(ret) {
                    device.log('delay_switch onSuccess: ' + JSON.stringify(ret));
                    pushMessageIntoHeadPanel( "receiver", "好的!" );
                },
                onError: function(ret) {
                    device.log('onError: ' + JSON.stringify(ret));
                }
            });
        }
        
        
        function sendCancelMessage( value ) {
            var toSendId = 500002;
            waitingMessaegReplyID = toSendId;
            device.send({
                datapoint: [{
                    id: toSendId,
                    apiName: 'set_data_point',
                    type: 'int32',
                    value: 1
                }],
                vibrate: 1,
                onSuccess: function(ret) {
                    device.log('cancel onSuccess: ' + JSON.stringify(ret));
                },
                onError: function(ret) {
                    device.log('onError: ' + JSON.stringify(ret));
                }
            });
        }
        
        function getMinuteFromString(value) {
            var toHandled = value;

            var startPos = value.indexOf( "点" );
            if ( startPos >= 0 ) {
                toHandled = value.substring( startPos + 1, value.length );
            }      
            
            if ( toHandled.indexOf( "分" ) > 0 ) {
                toHandled = toHandled.substring( 0, toHandled.indexOf( "分" ) );
            }
            
            if ( toHandled == "半" ) {
                return 30;
            }  else if ( toHandled != "" ) {
                return changeChineseToNumber( toHandled );
            } else {
                return 0;
            }
        }
        
        function getHourFromString(value) {         
            var ret = value.substring(0, value.indexOf("点") );
            return changeChineseToNumber( ret );            
        }
        
        function replaceAll(str, find, replace) {
            if ( str.indexOf( find ) > 0 ) {
                return str.replace(new RegExp(find, 'g'), replace);
            } else {
                return str;
            }
        }
        
        function sendOnTimeSwitchMessage( value ) {
            value = value.replace( "明早", "明天早上" );
            value = value.replace( "明晚", "明天晚上" );

            value = replaceAll( value, ':', '点' );
            value = replaceAll( value, '：', '点' );
            //alert(value);
            var timeBeginHour = -1;
            var timeBeginMinute = 0;
            var timeEndHour = -1;
            var timeEndMinute = 0;
            
            var posTimeStringBegin = value.indexOf( "下午" );

            var add12 = false;
            var containMonitorOrAfternoon = false;
            if ( posTimeStringBegin < 0 ) {
                posTimeStringBegin = value.indexOf( "晚上" );
            }
            if ( posTimeStringBegin >= 0 ) {
               add12 = true;
            } else {
                posTimeStringBegin = value.indexOf( "早上" );
                if ( posTimeStringBegin < 0 ) {
                    posTimeStringBegin = value.indexOf( "上午" );
                }
                if ( posTimeStringBegin < 0 ) {
                    posTimeStringBegin = value.indexOf( "早晨" );
                }
            } 
            
            var repeatTime = 1;
            var startDayCount = 0;
            if ( value.indexOf( "明天" ) >= 0  ) {
                repeatTime = 1;  
                startDayCount = 1;
            } else if ( value.indexOf( "后天" ) >= 0  ) {
                repeatTime = 1;  
                startDayCount = 2;
            } else if ( value.indexOf( "每天" ) >= 0 ) {
                repeatTime = -1;
            }
            
            //alert( posTimeStringBegin );
            if ( posTimeStringBegin >= 0 ) {
                //这个containMonitorOrAfternoon后面用来判断12点开灯这种情况
                containMonitorOrAfternoon = true;
                //这里+2是为了越过早上、晚上等字符
                posTimeStringBegin = posTimeStringBegin + 2;
            } else {
                //没写下午什么什么，直接就是几点到几点 或是明天几点到几点 或是每天几点到几点
                posTimeStringBegin = value.indexOf( "明天" );
                if ( posTimeStringBegin < 0 ) {
                    posTimeStringBegin = value.indexOf( "每天" );
                }
                
                if ( posTimeStringBegin < 0 ) {
                    posTimeStringBegin = value.indexOf( "后天" );
                }
                
                if (  posTimeStringBegin < 0 ) {
                    //明天、每天、上下午、晚上、早晨都没有，就是几点到几点
                    posTimeStringBegin = 0;
                } else {
                    //这是为了越过明天和每天这两个字符
                    posTimeStringBegin = posTimeStringBegin + 2;
                }
            }
            
            var posTimeStringEnd = value.indexOf( "打开" );
            var state = 1;
            if ( posTimeStringEnd < 0 ) {
                posTimeStringEnd = value.indexOf( "关" );
                state = 0;
            }
            
            if ( posTimeStringEnd < 0 ) {
                //不是打开，不是关，那就是开灯
                posTimeStringEnd = value.indexOf( "开" );
                state = 1;
            }
            
            var timeString = value.substring(posTimeStringBegin,posTimeStringEnd);
            //alert( posTimeStringBegin + "," +  posTimeStringEnd +  "," + timeString );
            
            timeBeginHour = timeString.substring(0, timeString.indexOf("点") );
            timeBeginHour = changeChineseToNumber( timeBeginHour );
            if ( timeBeginHour < 0 ) {
                setTimeout( pushMessageIntoHeadPanel, 500, "receiver", "您设置的时间太深奥，我理解不了" );    
                return;
            }
            
            //////////////////////////////////////////////////////
            // 获取当前时间，当前时间在解析十二点关灯这样的语句的时候用来判断是不是意思是24点  ///
            //////////////////////////////////////////////////////
            
            var myDate = new Date();
            var currentYear = myDate.getFullYear() - 2000;
            var currentMonth = myDate.getMonth() + 1;
            var currentDate = myDate.getDate();
            var currentHour = myDate.getHours();
            var currentMinute = myDate.getMinutes();
            var currentSecond = myDate.getSeconds();
            
            var midStringPos = timeString.indexOf( "到" );
            if ( midStringPos > 0 ) {
                
                //处理起始时间的分钟值
                timeBeginMinute = getMinuteFromString( timeString.substring(0, midStringPos ) );
         
                timeString = timeString.substring( midStringPos + 1, timeString.length );
                
                timeEndHour = getHourFromString( timeString );
                timeEndMinute = getMinuteFromString( timeString );  
                
                if ( timeBeginMinute < 0 || timeEndHour < 0 || timeEndMinute < 0 ) {
                    setTimeout( pushMessageIntoHeadPanel, 500, "receiver", "您设置的时间太深奥，我理解不了" );    
                    return;
                }
                
                if ( timeEndHour <= 12 && add12 ) {
                    timeEndHour = timeEndHour + 12;
                } else if ( startDayCount < 1 ) {
                    //这只是今天或明天的定时，如果是后天或是每天，必须采用24小时制
                    if ( timeBeginHour <= 12 && (!containMonitorOrAfternoon) ) {
                        if ( currentHour < timeBeginHour || ( currentHour == timeBeginHour && currentMinute < timeBeginMinute ) ) {
                            //比如现在早上4点，输入的是4点半关灯，那么应解释为早上4点半
                        } else if ( currentHour < 12 + timeBeginHour || ( currentHour == 12 + timeBeginHour && currentMinute < timeBeginMinute ) ) {
                            //比如现在是21点，输入的是10点或9点1分关灯，那么应解释为21点01关灯
                            add12 = true;
                            if ( timeEndHour > timeBeginHour || ( timeEndHour == timeBeginHour && timeEndMinute > timeBeginMinute ) ) {
                                timeEndHour = timeEndHour + 12;
                            }
                        }
                    }
                }
            } else {
                //这不是几点到几点这样的语句，那么这就是十二点开灯这样的语句
                
                timeBeginMinute = getMinuteFromString( timeString );
                if ( timeBeginMinute < 0  ) {
                    setTimeout( pushMessageIntoHeadPanel, 500, "receiver", "您设置的时间太深奥，我理解不了" );    
                    return;
                }
                if ( timeBeginHour <= 12 && (!containMonitorOrAfternoon) ) {
                    if ( currentHour < timeBeginHour || ( currentHour == timeBeginHour && currentMinute < timeBeginMinute ) ) {
                        //比如现在早上4点，输入的是4点半关灯，那么应解释为早上4点半
                    } else if ( currentHour < 12 + timeBeginHour || ( currentHour == 12 + timeBeginHour && currentMinute < timeBeginMinute ) ) {
                        //比如现在是21点，输入的是10点或9点1分关灯，那么应解释为21点01关灯
                        add12 = true;
                    }
                }
                
                if ( startDayCount > 0 && (!containMonitorOrAfternoon) ) {
                    //明天和后天这两种情况
                    add12 = false;
                }
            }
            
            if ( timeBeginHour <= 12 && add12 ) {
                timeBeginHour = timeBeginHour + 12;
            }
            
            if ( timeBeginHour == 24 ) {
                timeBeginHour = 0;
            }
    
            if ( timeEndHour == 24 ) {
                timeEndHour = 0;
            }
            
            //add on 2015-11-18, 现在是晚上9点20分，输8点开灯 或者是输9点19分开灯，startDayCount设为1
            if ( startDayCount < 1 && ( currentHour > timeBeginHour || ( currentHour == timeBeginHour && currentMinute > timeBeginMinute ) ) ) {
            	startDayCount = 1    
            }
            
            //alert( timeBegin + "," + timeEnd );
            
            
            printDeviceLogFor500003( currentYear&0xFF, currentMonth&0xFF, currentDate&0xFF, currentHour&0xFF,currentMinute&0xFF,currentSecond&0xFF,timeBeginHour&0xFF,timeBeginMinute&0xFF,timeEndHour&0xFF,timeEndMinute&0xFF,repeatTime&0xFF,state&0xFF, startDayCount&0xFF );

            var toSendId = 500003;
            waitingMessaegReplyID = toSendId;
            device.send({
                datapoint: [{
                    id: toSendId,
                    apiName: 'set_data_point',
                    type: 'bytearray',
                    value: [currentYear&0xFF, currentMonth&0xFF, currentDate&0xFF,currentHour&0xFF,currentMinute&0xFF,currentSecond&0xFF,timeBeginHour&0xFF,timeBeginMinute&0xFF,timeEndHour&0xFF,timeEndMinute&0xFF,repeatTime&0xFF,state&0xFF,startDayCount&0xFF]
                }],
                vibrate: 1,
                onSuccess: function(ret) {
                    device.log('on_time_switch onSuccess: ');
                    if ( !isIOS ) {
                        pushMessageIntoHeadPanel( "receiver", "收到!" );
                    }
                },
                onError: function(ret) {
                    device.log('onError: ' + JSON.stringify(ret));
                }
            });
        }
        
        function isDelaySwitchMessage( value ) {
            var r = new RegExp("后开|后关");
            return r.test( value );
        }
        
        function isOnTimeSwitchMessage( value ) {
            var r = new RegExp("到|点开|分开|点关|分关|半关|半开");
            var ret = r.test( value );
            if ( !ret ) {
                var r1 = new RegExp("点|:|：");
                var r2 = new RegExp("开|关");
                ret = ( r1.test( value ) && r2.test( value ) );
            }
            return ret;
        }
        
        function isBreathLightControlMessage( value ) {
            var r = new RegExp("到");
            return r.test( value );
        }
        
        function inputisValid( value ) {
            var r = new RegExp("开|关|打开|关闭|开灯|关灯|取消|不要关了|不要开了|恢复|cancel");
            return r.test( value );
        }
        
        function isBreathLightControlMessage( value ) {
            var r = new RegExp("呼吸灯");
            return r.test( value );
        }
        
        function isCancelMessage( value ) {
            var r = new RegExp("取消|不要关了|不要开了|恢复|cancel");
            return r.test( value );
        }
        
        function clickSendButton() {
            
            var o = document.getElementById("inputTextBox");
            
            var sendValue = o.value;
            pushMessageIntoHeadPanel( "sender", sendValue );
            document.getElementById( "sendButton" ).disabled = "disabled";
            o.value = "";
            o.placeholder = "点击进行辅助输入";
            
            sendValue = sendValue.replace(/\s+/g, '');

            sendValue = replaceAll( sendValue, '点钟', '点' );
            sendValue = replaceAll( sendValue, '点整', '点' ); 
             
            var ret = inputisValid( sendValue);
            var validMessageSendSuccess = false;
            if ( !inputisValid( sendValue) ) {
                setTimeout( pushMessageIntoHeadPanel, 500, "receiver", "我暂时理解不了您说的话" );
            } else {
                if ( sendValue == "关灯" || sendValue == "关闭" || sendValue == "关" || sendValue == "off" ) {
                	send500001Message( 0 );
                } else if ( sendValue == "开灯" || sendValue == "打开" || sendValue == "开" || sendValue == "on" ) {
                	send500001Message( 1 );
                } else if ( isDelaySwitchMessage( sendValue) ) {
                    sendDelayMessage( sendValue );
                    validMessageSendSuccess = true;
                } else if ( isOnTimeSwitchMessage( sendValue ) ) {
                    sendOnTimeSwitchMessage( sendValue );
                    validMessageSendSuccess = true;
                } else if ( isBreathLightControlMessage( sendValue ) ) {
                     sendBreathLightMessage( sendValue );
                     validMessageSendSuccess = true;
                } else if ( isCancelMessage( sendValue ) ) {
                    sendCancelMessage( sendValue );
                } else {
                    setTimeout( pushMessageIntoHeadPanel, 500, "receiver", "我暂时理解不了您说的话，我会努力学习的。" );
                }
            }
            
            if ( validMessageSendSuccess ) {
                addMessageIntoCookie( sendValue );
            }
        }
        
	    function createReceiver( value ) {
        	var div = document.createElement("div");
        	
        	div.className = "receiver";
        	
        	
        	var imgDiv = document.createElement("div");
        	var img = document.createElement("img");
    
            imgDiv.appendChild( img );
        	img.src = "http://wa-ou.com/resources/images/products/qqlightapp-yong.png";
        	div.appendChild( imgDiv );
        	
        	var triangleContainer = document.createElement("div");
        	div.appendChild( triangleContainer );
    
            var triangle = document.createElement("div");
            triangleContainer.appendChild( triangle );
            triangle.className = "right_triangle";
            triangleContainer.innerHTML += "<span>" + value + "</span>";
            
            
        	return div;
        }
        
        function createSender( value ) {
            var div = document.createElement("div");
            
            div.className = "sender";
            
            
            var imgDiv = document.createElement("div");
            var img = document.createElement("img");
    
            imgDiv.appendChild( img );
            img.src = "http://wa-ou.com/resources/images/products/qqlightapp-switch-button-small.png";
            div.appendChild( imgDiv );
            
            var triangleContainer = document.createElement("div");
            div.appendChild( triangleContainer );
    
            var triangle = document.createElement("div");
            triangleContainer.appendChild( triangle );
            triangle.className = "left_triangle";
            triangleContainer.innerHTML += "<span>" + value + "</span>";
            triangleContainer.onclick = function() {
                clickLine(value);
            }
            return div;
        }
        
        function setGuideMessage() {
        	if ( switchCurrentState == "on" ) {
        		document.getElementById("allGuideMessage1").value = "半小时后关灯";
        	} else {
        		document.getElementById("allGuideMessage1").value = "半小时后开灯";
        	}
        }
        
        function receiveMessage() {
        	device.onReceive(function (data) {
                //device.log("enter into receiveMessage: " + JSON.stringify(data) + ", data.id = " + data.id );
                switch (data.id) {
                    case 500010:
                      //device.log( "data.value[0] = " + data.value[0] )
                      if ( data.value[0] == '0x11' ) {
                          device.log("现在灯是开的状态")
                          switchCurrentState = "on";
                      }  else if ( data.value[0] == '0x10' ) {
                          switchCurrentState = "off";
                          device.log("现在开关是关闭状态")
                      } else {
                          switchCurrentState = "on";
                      } 
                      setGuideMessage();
                    break;
                    case 500003:
                        if ( waitingMessaegReplyID == data.id ) {

                            var shownMessage = "收到！";
                        	if ( data.value[0] != '0xFF' ) {
                                if ( !alreadySendCancelGuideMessage ) {
                                    shownMessage = shownMessage + "需要取消时，告诉我就可以啦。"
                                    alreadySendCancelGuideMessage = true;
                                }
                        	} else {
                        		shownMessage = "我暂时理解不了您说的话";
                        	}
                        	
                        	pushMessageIntoHeadPanel( "receiver", shownMessage );
                        } else {
                        	device.log( "waitingMessaegReplyID = " + waitingMessaegReplyID + ", but got: " + data.id );
                        }
                    break;
                    case 500004:
                        if ( waitingMessaegReplyID == data.id ) {
                    	var shownMessage = "好的，我记下了!";
                            if ( !alreadySendCancelGuideMessage ) {
                                shownMessage = shownMessage + "需要取消时，告诉我就可以啦。"
                                alreadySendCancelGuideMessage = true;
                            }
                            pushMessageIntoHeadPanel( "receiver", shownMessage );
                        } else {
                        	device.log( "waitingMessaegReplyID = " + waitingMessaegReplyID + ", but got: " + data.id );
                        }
                    break;
                    case 500002:
                        if ( waitingMessaegReplyID == data.id ) {
                          pushMessageIntoHeadPanel( "receiver", "收到，已经取消了!" );
                        } else {
                            device.log( "waitingMessaegReplyID = " + waitingMessaegReplyID + ", but got: " + data.id );
                        }
                    break;
                }
           });
        	

            device.onDeviceInfoChange = function (k) {
            	device.log("I already capture this, so to hide off-line message");
            };
        }
        
        function getCurrentSwitchState() {
        	var toSendId = 500010;
            waitingMessaegReplyID = toSendId;
            device.send({
                datapoint: [{
                    id: toSendId,
                    apiName: 'set_data_point',
                    type: 'int32',
                    value: 1
                }],
                vibrate: 1,
                onAck : function (ret) { 
                    //nothing
                    //go to receiveMessage
                }
            });
        	
        	//receiveMessage();
        } 
        
        function setSwitchButtonSize() {
        	var m = document.getElementById("middle");
        	var o = document.getElementById("switchButton");
        	var height = m.getBoundingClientRect().height * 0.8;

        	device.log( height );
        	if ( parseInt(height) < 180 ) {
        		height =  parseInt(height) * 0.95;
        	} else if ( parseInt(height) < 130 ) {
        		height =  parseInt(height) * 0.9;
        	} else if ( parseInt(height) < 100 ) {
        		height =  parseInt(height) * 0.7;
        	}
        	
        	o.style.width =  height + "px";
        	o.style.height = o.style.width;
        }

        function getCookie(name)
        {
	        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	        if(arr=document.cookie.match(reg)) {
		        return unescape(arr[2]);
	        }
	        else {
		        return "";
	        }
        }
        
        function setCookie(name,value)
        {
	        var Days = 30;
	        var exp = new Date();
	        exp.setTime(exp.getTime() + Days*24*60*60*1000);
	        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        }
        
        function addMessageIntoCookie( sendValue ) {
        	if ( sendMessageInCookie.length == 0 ) {
        		sendMessageInCookie = getCookie( cookieKey );
        	}
        	
        	var allMessages = sendMessageInCookie.split( ";" );
        	for ( var i = 0; i < allMessages.length; i++ ) {
        		if ( allMessages[i] == sendValue ) {
        			return;
        		}
        	}
        	
        	for ( var i = 0; i < preDefinedMessages.length - allMessages.length; i++ ) {
                if ( preDefinedMessages[i] == sendValue ) {
                    return;
                }
            }
        	

        	var messageLength = allMessages.length;
        	if ( messageLength >= totalMessageSizeInCookie ) {
        		messageLength = totalMessageSizeInCookie;
        	}
        	
        	for ( var i = messageLength - 1; i > 0 ; i-- ) {
    			allMessages[i] = allMessages[i-1];
    		}
        	
        	allMessages[0] = sendValue;
        	
        	sendMessageInCookie = "";
        	for ( var i = 0; i < allMessages.length; i++ ) {
        		if ( allMessages[i].length != 0 ) {
            		sendMessageInCookie = sendMessageInCookie + allMessages[i] + ";";
        		}
        	}
        	//alert( sendMessageInCookie );
        	setCookie( cookieKey, sendMessageInCookie );
        	setSelectOptions();
        }
        
        function setSelectOptions() {
        	var select = document.getElementById('inputTextSelect');
        	if ( sendMessageInCookie.length == 0 ) {
        		sendMessageInCookie = getCookie( cookieKey );
        	}
        	var allMessages = sendMessageInCookie.split( ";" );
			select.innerHTML = "";
			
	       	
	       	for ( var i = 0; i < allMessages.length; i++ ) {
	       		if ( allMessages[i].length > 0 ) {
	       			var opt = document.createElement('option');
	        	    opt.value = allMessages[i];
	        	    opt.innerHTML = allMessages[i];
	        	    select.appendChild(opt);
	       		}	       		
	       	}
	       	
	       	
	       	var toAddedPredefintedCount = preDefinedMessages.length - allMessages.length;
	       	if ( device.debug ) {
                //调试模式有很复杂的消息
                preDefinedMessages = allDetailedTestMessages;
                toAddedPredefintedCount = preDefinedMessages.length;
            }
            
	       	
	       	for ( var i = 0; i< toAddedPredefintedCount; i++ ){
	       		if ( allMessages.indexOf( preDefinedMessages[i] ) <= -1 ) {
	       			var opt = document.createElement('option');
	                opt.value = preDefinedMessages[i];
	                opt.innerHTML = preDefinedMessages[i];
	                select.appendChild(opt);
	       		}
        	}
        }
        
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        
        function initGuideMessages() {
        	var deviceName = getParameterByName( "deviceRemark" );
        	var userName = getParameterByName( "userName" );
            if ( deviceName == "" ) {
                deviceName = "智能灯";
            }
            if ( userName != "" && userName != "蓝牙开关" ) {
                head.appendChild( createReceiver("您好，" + userName + "！") );
            }
            setTimeout( pushMessageIntoHeadPanel, 300, "receiver", "我是" + deviceName + "，您可以直接发信息给我。" );
            setTimeout( pushMessageIntoHeadPanel, 300, "receiver", "点输入框有提示哦！");
        }
        
        window.onload = function() {      
            var head = document.getElementById("head");        
            setSwitchButtonSize();            
            receiveMessage();
            getCurrentSwitchState();
            //setCookie( cookieKey, "" );
            setSelectOptions();
            initGuideMessages();
            isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
        };
        
        // Listen for orientation changes
        window.addEventListener("orientationchange", function() {
        	setSwitchButtonSize();
        }, false);