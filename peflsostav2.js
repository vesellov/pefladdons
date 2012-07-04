// ==UserScript==
// @name           peflsostav
// @namespace      pefl
// @description    Display sostav
// @include        http://*pefl.*/*?sostav
// @include        http://*pefl.*/*?sostav_n
// @version        2.0
// ==/UserScript==

deb = (localStorage.debug == '1' ? true : true)
var debnum = 0

var ff 	= (navigator.userAgent.indexOf('Firefox') != -1 ? true : false)
var data = []
var plkeys = []
var players = []
var plskillmax = 15
var tabslist = ''
var maxtables = 25

var skillnames = {
//s
//f
//сс
srt:{rshort:'сила'},
//са
//со
nation:{rshort:'кСт',rlong:''},
natfull:{rshort:'стр',rlong:''},
secondname:{rshort:'Фам'},
firstname:{rshort:'Имя'},
age:{rshort:'взр',rlong:''},
//id:{rshort:'id'},
internationalapps:{rshort:'иСб',rlong:''},
internationalgoals:{rshort:'гСб',rlong:''},
contract:{rshort:'кнт',rlong:'Контракт'},
wage:{rshort:'зрп',rlong:'Зарплата'},
value:{rshort:'ном',rlong:'Номинал'},
corners:{rshort:'уг',rlong:'Угловые'},
crossing:{rshort:'нав',rlong:'Навесы'},
dribbling:{rshort:'др',rlong:'Дриблинг'},
finishing:{rshort:'уд',rlong:'Удары'},
freekicks:{rshort:'шт',rlong:'Штрафные'},
handling:{rshort:'ру',rlong:'Игра руками'},
heading:{rshort:'гл',rlong:'Игра головой/Игра на выходах'},
leadership:{rshort:'лд',rlong:'Лидерство'},
longshots:{rshort:'ду',rlong:'Дальние удары'},
marking:{rshort:'по',rlong:'Персональная опека'},
pace:{rshort:'ск',rlong:'Скорость'},
passing:{rshort:'пс',rlong:'Пас'},
positioning:{rshort:'вп',rlong:'Выбор позиции'},
reflexes:{rshort:'ре',rlong:'Реакция'},
stamina:{rshort:'вн',rlong:'Выносливость'},
strength:{rshort:'мщ',rlong:'Мощь'},
tackling:{rshort:'от',rlong:'Отбор'},
vision:{rshort:'ви',rlong:'Видение'},
workrate:{rshort:'рб',rlong:'Работоспособность'},
technique:{rshort:'тх',rlong:'Техника'},
morale:{rshort:'мрл',rlong:'Мораль'},
form:{rshort:'фрм',rlong:'Форма'},
position:{rshort:'поз',rlong:'Позиция'},
/**
games
goals
passes
mom
ratingav
cgames
cgoals
cpasses
cmom
cratingav
egames
egoals
epasses
emom
eratingav

wgames
wgoals
wpasses
wmom
wratingav

fgames
fgoals
fpasses
fmom
fratingav
vratingav
training
/**/
inj:{rshort:'трв',rlong:'Травма'},
sus:{rshort:'дск',rlong:'Дисквалификация'},
syg:{rshort:'сыг',rlong:'Сыгранность'},
/**
agames
agoals
apasses
amom
/**/
}

var positions = [
	{					name:'&nbsp;'},
/**  1 **/	{filter:'GK', 	name:'GK', 		koff:'reflexes=reflexes*3,positioning=positioning*2,heading=heading*2,handling=handling*1.5,!strength=strength*0.7,!pace=pace*0.4,secondname,srt'},
/**  2 **/	{filter:'C SW',	name:'C SW',	koff:'positioning=positioning*2,tackling=tackling*1.5,secondname,srt'},
/**  3 **/	{filter:'L DF',	name:'L DF',	koff:'positioning=positioning*2,tackling=tackling*1.5,pace=pace*1.5,crossing=crossing,secondname,srt'},
/**  4 **/	{filter:'R DF',	name:'R DF',	koff:'positioning=positioning*2,tackling=tackling*1.5,pace=pace*1.5,crossing=crossing,secondname,srt'},
/**  5 **/	{filter:'L DM',	name:'L DM',	koff:'tackling=tackling*1.5,pace=pace*1.5,vision=vision,crossing=crossing,secondname,srt'},
/**  6 **/	{filter:'R DM',	name:'R DM',	koff:'tackling=tackling*1.5,pace=pace*1.5,vision=vision,crossing=crossing,secondname,srt'},
/**  7 **/	{filter:'C DF',	name:'C DF',	koff:'tackling=tackling*3,positioning=positioning*3,strength=strength*1.5,pace=pace*1.5,heading=heading*1.5,secondname,srt'},
/**  8 **/	{filter:'C DM',	name:'C DM',	koff:'positioning=positioning*3,tackling=tackling*3,vision=vision*2,workrate=workrate*2,!technique=technique*1.5,!passing=passing*1.5,secondname,srt'},
/**  9 **/	{filter:'C M',	name:'C M',		koff:'positioning=positioning*2,vision=vision*2,passing=passing*2,technique=technique*1.5,!tackling=tackling,!longshots=longshots*0.5,secondname,srt'},
/** 10 **/	{filter:'L M',	name:'L M',		koff:'pace=pace*2,dribbling=dribbling*2,passing=passing*2,vision=vision*2,!crossing=crossing*1.5,!tackling=tackling*1.5,!technique=technique,secondname,srt'},
/** 11 **/	{filter:'R M',	name:'R M',		koff:'pace=pace*2,dribbling=dribbling*2,passing=passing*2,vision=vision*2,!crossing=crossing*1.5,!tackling=tackling*1.5,!technique=technique,secondname,srt'},
/** 12 **/	{filter:'C AM',	name:'C AM',	koff:'positioning=positioning*2,vision=vision*2,passing=passing*2,technique=technique*2,!longshots=longshots,!dribbling=dribbling,secondname,srt'},
/** 13 **/	{filter:'L AM',	name:'L AM',	koff:'pace=pace*3,dribbling=dribbling*2.5,crossing=crossing*2,vision=vision*1.5,!passing=passing*1.5,!technique=technique,secondname,srt'},
/** 14 **/	{filter:'R AM',	name:'R AM',	koff:'pace=pace*3,dribbling=dribbling*2.5,crossing=crossing*2,vision=vision*1.5,!passing=passing*1.5,!technique=technique,secondname,srt'},
/** 15 **/	{filter:'C FW',	name:'C FW',	koff:'finishing=finishing*3,positioning=positioning*2,pace=pace*2,dribbling=dribbling*1.5,!heading=heading*1.5,!strength=strength*1.5,secondname,srt'}
]
var selected = '0,'
	+'0,15,0,'		// линия FW
	+'0,12,0,0,14,'	// линия AM
	+'10,0,9,0,0,'	// линия MF
	+'0,0,8,0,6,'	// линия DM
	+'3,0,0,7,0,'	// линия DF
	+'2,1'			// линия SW & Gk

$().ready(function() {
	if(deb) $('body').prepend('<div id=debug></div>')

	if(localStorage.selected != undefined){
		debug('selected from lS')
		selected = String(localStorage.selected)
	}
	selected = selected.split(',')

	var geturl = (location.search.substring(1) == 'sostav' ? 'fieldnew3.php' : 'fieldnew3_n.php')
	PrintTables(geturl)
	$.get(geturl, {}, function(datatext){
		debug('geturl')
		var dataarray = datatext.split('&');
		var i = 0;
		var check = false
		while(dataarray[i] != null) {
			tmparr = dataarray[i].split('=');
			i++;
			var tmpkey = tmparr[0];
			var tmpvalue = tmparr[1];
			data[tmpkey] = tmpvalue;
			if(tmpkey == 'nation0') check = true
			if(tmpkey == 'nation1') check = false
			if(check) plkeys.push(tmpkey.replace('0',''))
		}
		getPlayers()
		getPositions()
		FillHeaders()
	})
})

function debug(text) {if(deb) {debnum++;$('div#debug').append(debnum+'&nbsp;\''+text+'\'<br>');}}

function sSrt(i, ii) { // по убыванию
	var s = (i.srt!=undefined ? 'srt' : '!srt')
    if 		(i[s] < ii[s])	return  1
    else if	(i[s] > ii[s])	return -1
    return  0
}


function getPositions(){
	debug('getPositions()')
	// TODO: + custom positions(from forum)


	for(i=1;i<positions.length;i++){
		if(positions[i].strmax==undefined) positions[i].strmax = countStrength(0,positions[i].koff)
		var pls = []
		var pos = positions[i].filter.split(' ')
		for(j in players){
			var pl = {}
			var pkoff = positions[i].koff.split(',')
			for(h in pkoff){
				var koff = String(pkoff[h].split('=')[0])//.replace(/\!/g,'')
				pl[koff] = (players[j][koff.replace(/\!/g,'')]==undefined ? 0 : players[j][koff.replace(/\!/g,'')])
			}
			var	pos0 = false
			var pos1 = false
			var plpos = players[j].position
			if(pos[1]==undefined) {
				pos1 = true
				if(plpos.indexOf(pos[0]) != -1) pos0 = true
			} else {
				for(k=0;k<3;k++) if(plpos.indexOf(pos[0][k]) != -1) pos0 = true
				pos1arr = pos[1].split('/')
				for(k in pos1arr) if((plpos.indexOf(pos1arr[k]) != -1)) pos1 = true
			}
			pl.posf = (pos0 && pos1 ? true : false)
			var s = (pl.srt!=undefined ? 'srt' : (pl['!srt']!=undefined!=undefined ? '!srt' : ''))
			if(s!='' && pl[s]!=undefined) pl[s] = (positions[i].strmax==0 ? 0 : (countStrength(j,positions[i].koff)/positions[i].strmax)*100)
//			debug(positions[i].filter+':'+'/'+positions[i].strmax+'='+pl.srt+'%:'+players[j].secondname)

			pls.push(pl)
		}
		positions[i].pls = pls.sort(sSrt)
	}
}
function countStrength(plid,pkoff){
	var pl = (plid==0 ? players[players.length-1] : players[plid])
	pkoff = pkoff.split(',')
	var res = 0
	for(n in pkoff){
		var koff = pkoff[n].split('=')
		if(koff[1]!=undefined){
			for(p in pl){
				if(koff[1].indexOf(p)!=-1 && !isNaN(pl[p])){
					var reg = new RegExp(p, "g")
					var count = koff[1].replace(reg,(plid==0 ? plskillmax : pl[p]))
				}
			}
		}
		//debug(count)
		res += (count==undefined ? 0 : eval(count))
	}
	return res
}

function FillData(nt){
	var np = $('#select'+nt+' option:selected').val()
	//debug('FillData('+nt+'):'+np)
/**/
	$('#table'+nt).remove()
	if(np!=0){
		var html = '<table id=table'+nt+' width=100%>'
		var head = true
    	for(t in positions[np].pls){
			var pl = positions[np].pls[t]
			var plhtml = '<tr'+(!pl.posf ? ' hidden abbr=wrong' : '')+'>'
			var font1 = (!pl.posf ? '<font color=red>' : '')
			var font2 = (!pl.posf ? '</font>' : '')
			if(head) var headhtml = '<tr>'
			for(pp in pl) {
				if(pp!='posf'){
					var hidden = ''
					var p = pp
					if(pp.indexOf('!')!=-1){
						p = pp.replace(/\!/g,'')
						hidden = ' hidden abbr=hidden'
					}
					plhtml += '<td'+hidden+'>'+font1
					plhtml += (typeof(pl[pp])=='number' ? pl[pp].toFixed(1) : (pl[pp]==undefined ? '??' : pl[pp]))
					plhtml += font2+'</td>'
					if(head) {
						headhtml += '<td'+hidden+(skillnames[p]!=undefined && skillnames[p].rlong!=undefined ? ' title="'+skillnames[p].rlong+'"' : '')+'>'
						headhtml += (skillnames[p]!=undefined && skillnames[p].rshort!=undefined ? skillnames[p].rshort : p)
						headhtml += '</td>'
					}
				}
			}
			plhtml += '</tr>'
			if(head) headhtml += '</tr>'
			html += (head ? headhtml : '') + plhtml
			head = false
		}
		html += '</table>'
		$('#htable'+nt).after(html)
	}
	MouseOff(nt)
/**/
}

function getPlayers(){
	var numPlayers = parseInt(data['n'])
	debug('numPlayers:'+numPlayers)
	for(i=0;i<numPlayers;i++){
		var pl = {}
		for(j in plkeys) {
			pl[plkeys[j]] = data[plkeys[j]+i]
		}
		players[pl.id] = pl
	}
	//for(i in players[9677]) debug(i+':'+players[9677][i])
}

function FillHeaders(){
	debug('FillHeaders():'+maxtables)
	for(i=1;i<=maxtables;i++){
		for(j in positions) $('#select'+i).append('<option value='+j+'>'+positions[j].name+'</option>')
		var name = positions[0].name
		if(positions[selected[i]] !=undefined && positions[selected[i]].name != undefined) {
			name = positions[selected[i]].name
		}
		if (selected[i]!=undefined) $('#select'+i+' option:eq('+selected[i]+')').attr('selected', 'yes')
		$('#span'+i).html(name)
		FillData(i)
	}
}

function PrintTables(geturl) {
	debug('PrintTables()')
	$('td.back3:first').hide()
	var newhtml = '<br><br>'
	newhtml += '<table width=100% bgcolor=#C9F8B7>'
	var num = 1
	for(i=1;i<8;i++){
		newhtml += '<tr id=tr'+i+' bgcolor=#A3DE8F>'
		for(j=1;j<6;j++){
			if(i==1 && j==1) {
				newhtml += '<td valign=center height=90 id=td'+num+' bgcolor=#C9F8B7 align= center >'
				newhtml += '<img height=90 src=/system/img/'
				if(geturl=='fieldnew3_n.php') newhtml += (isNaN(parseInt(localStorage.myintid)) ? 'g/int.gif' : 'flags/full'+(parseInt(localStorage.myintid)>1000 ? parseInt(localStorage.myintid)-1000 : localStorage.myintid)+'.gif')+'>'
				else newhtml += (isNaN(parseInt(localStorage.myteamid)) ? 'g/team.gif' : 'club/'+localStorage.myteamid+'.gif')+'>'
			} else if (i==1 && j==5){
				newhtml += '<td valign=top height=90 id=td'+num+' bgcolor=#C9F8B7 align= center>'+ShowHelp()
			} else if (i>5 && j!=3){
				newhtml += '<td valign=top height=90 id=td'+num+' bgcolor=#C9F8B7 align= center>'
			} else {
				newhtml += '<td valign=top width=20% height=90 id=td'+num+'>'
				newhtml += '<table id=htable'+num+' width=100%><tr><td onmousedown="MouseOn(\''+num+'\')">'
				newhtml +=  '<div id=div'+num+'>'
				newhtml += 	 '<span id=span'+num+'>&nbsp;</span>'
				newhtml += 	 '<select hidden id=select'+num+' onchange="FillData(\''+num+'\')">'
				newhtml += 	 '</select>'
				newhtml +=  '</div>'
				newhtml += '</td><td id=links'+num+' align=right hidden>'
				newhtml +=  '<a href="javascript:void(showAll(\''+num+'\'))">*</a>'
				newhtml += '</td></tr></table>'
				num++
			}
			newhtml += '</td>'
		}
		newhtml += '</tr>'
	}
	newhtml += '</table>'
	newhtml += '<hr>'
	newhtml += 'Дополнительные таблицы:'
	newhtml += '<hr>'
	$('td.back4').html(newhtml)
}
function showAll(nt){
	if($('table#table'+nt+' tr[abbr*=wrong]:first').is(':visible')) {
		$('table#table'+nt+' tr[abbr*=wrong]').hide()
		$('table#table'+nt+' td[abbr*=hidden]').hide()
	} else{
		$('table#table'+nt+' tr[abbr*=wrong]').show()
		$('table#table'+nt+' td[abbr*=hidden]').show()
	}
}

function MouseOn(num){
//	if($('#select'+num).is(':visible'))
		$('#span'+num).hide()
		$('#links'+num).hide()
		$('#select'+num).show().select()
}
function MouseOff(num){
	if($('#select'+num).val()!=0) {
		$('#span'+num).html('<b>'+$('#select'+num+' option:selected').text()+'</b>')
		$('#links'+num).show()
	} else {
		$('#span'+num).html(positions[0].name)
	}
	$('#select'+num).hide()
	$('#span'+num).show()

}

function ShowHelp(){
	var html = ''
	html += '<table bgcolor=#A3DE8F >'
	html += '<tr><th colspan=4>'+'HELP'.fontsize(1)+'</th></tr>'
	html += '<tr><td bgcolor=#FFFFFF colspan=2>'+'основа'.fontsize(1)+'</td>'
	html += '<td bgcolor=#BABDB6 colspan=2>'+'в заявке'.fontsize(1)+'</td></tr>'
	html += '<tr><td colspan=4><font color=red size=1>не своя позиция</font></td></tr>'
	html += '<tr><td bgcolor=#EF2929></td><td>'+'трв'.fontsize(1)+'</td>'
	html += '<td bgcolor=#A40000></td><td>'+'дск'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#FCE94F></td><td>'+'фрм<90'.fontsize(1)+'</td>'
	html += '<td bgcolor=#E9B96E></td><td>'+'мрл<80'.fontsize(1)+'</td></tr>'
	html += '<tr><td bgcolor=#729FCF></td><td>'+'шкл'.fontsize(1)+'</td>'
	html += '<td bgcolor=#green></td><td>'+'чужой'.fontsize(1)+'</td></tr>'
	html += '</table>'
	return html
}