// ==UserScript==
// @name            HV Chinese
// @namespace       hentaiverse
// @match           http*://hentaiverse.org/*
// @icon            https://e-hentai.org/favicon.ico
// @description     HV面板数据界面汉化,有时候会修复一些网页的显示错误
// @author          carry0987
// @version         1.0.0
// ==/UserScript==

if (document.getElementById("monsterpane") == undefined || document.location.href == 'https://hentaiverse.org/?s=Character&ss=it') {
    var torep = new Array();
    var repby = new Array();
    var xlpan = new Array();
    var xlpanh = new Array();
    aaa = document.location.href.match("=Character&ss=eq");
    if (document.location.href == 'https://hentaiverse.org/?s=Character&ss=ch' || aaa == "=Character&ss=eq" && document.querySelector("#rightpane") != null) {
        fanyiliebiao()
        //右侧状态
        rightpan = document.querySelector("#rightpane").innerHTML;
        if (aaa != "=Character&ss=eq") {
            //主要状态
            mainpan = document.querySelector("#leftpane.eql").innerHTML;
            for (var i = 0; i < torep.length; i++) {
                var regex = new RegExp(torep[i], 'g');
                mainpan = mainpan.replace(regex, repby[i]);
            }

            document.querySelector("#leftpane.eql").innerHTML = mainpan;
        }
        for (var i = 0; i < torep.length; i++) {
            var regex = new RegExp(torep[i], 'g');
            rightpan = rightpan.replace(regex, repby[i]);
        }

        document.querySelector("#rightpane").innerHTML = rightpan;
        var torep = new Array();
        var repby = new Array();
        rightlink()
        mainlink()
    }

    if (document.location.href == 'https://hentaiverse.org/?s=Bazaar&ss=ss') {
        document.getElementById("accept_button").style.cssText = "padding-right:60px;padding-top:20px"
        document.body.innerHTML.match(/[0-9]+item_pane/g)
        temp = document.body.innerHTML.match(/[0-9]+item_pane/g)
        for (x in temp) {
            isFigurine = document.getElementById(temp[x]).innerHTML.match(/Figurine/)
            if (isFigurine) {
                //alert(1)
                document.getElementById(temp[x]).style.background = "lightgreen";
            }
        }
    }
    showrecpd = 0
    var showrec = document.createElement("div");
    showrec.innerHTML = '回复'
    showrec.onmouseover = function() {
        if (showrecpd == 1) return
        showrecpd = 1
        var recover1 = document.createElement("div");
        recover1.innerHTML = '体力'
        recover1.onmouseover = function() { this.style.background = "green" }
        recover1.onmouseout = function() { this.style.background = "black" }
        recover1.onclick = function() { recover_submit('health') }
        recover1.style.cssText = "z-index:1000;font-size:20px;color:white ;cursor:pointer; text-align:left;background:black;position:absolute;left:60px;top:260px";
        document.body.appendChild(recover1);
        var recover2 = document.createElement("div");
        recover2.innerHTML = '魔力'
        recover2.onmouseover = function() { this.style.background = "blue" }
        recover2.onmouseout = function() { this.style.background = "black" }
        recover2.onclick = function() { recover_submit('magic') }
        recover2.style.cssText = "z-index:30;font-size:20px;color:white ;cursor:pointer; text-align:left;background:black;position:absolute;left:60px;top:300px";
        document.body.appendChild(recover2);
        var recover3 = document.createElement("div");
        recover3.innerHTML = '灵力'
        recover3.onmouseover = function() { this.style.background = "red" }
        recover3.onmouseout = function() { this.style.background = "black" }
        recover3.onclick = function() { recover_submit('spirit') }
        recover3.style.cssText = "z-index:30;font-size:20px;color:white ;cursor:pointer; text-align:left;background:black;position:absolute;left:60px;top:340px";
        document.body.appendChild(recover3);

        var recover5 = document.createElement("div");
        recover5.innerHTML = '全部'
        recover5.onmouseover = function() { this.style.background = "white";
            this.style.color = "black" }
        recover5.onmouseout = function() { this.style.background = "black";
            this.style.color = "white" }
        recover5.onclick = function() { recover_submit('all') }
        recover5.style.cssText = "z-index:40;font-size:20px;color:white ;cursor:pointer; text-align:left;background:black;position:absolute;left:60px;top:380px";
        document.body.appendChild(recover5);
        var recover4 = document.createElement("div");
        recover4.innerHTML = '精力'
        recover4.onmouseover = function() { this.style.background = "pink" }
        recover4.onmouseout = function() { this.style.background = "black" }
        recover4.onclick = function() { if (confirm("确定使用能量药剂?\n这会消费一瓶能量药水(ED)并且回复10点精力!(空格确认)")) recover_submit('stamina') }
        recover4.style.cssText = "z-index:30;font-size:20px;color:white ;cursor:pointer; text-align:left;background:black;position:absolute;left:60px;top:420px";
        document.body.appendChild(recover4);
    }
    //showrec.onmouseout=function(){this.style.background="black"}
    //showrec.onclick=function(){recover_submit('health')}
    showrec.style.cssText = "z-index:1000;font-size:20px;color:white ;cursor:pointer; text-align:left;background:black;position:absolute;left:20px;top:260px";
    document.body.appendChild(showrec);








    leftpan = document.querySelector(".clb").innerHTML; //左侧状态
    toppan1 = document.querySelector("#child_Character.cnbc").innerHTML; //下拉1
    toppan2 = document.querySelector("#child_Battle.cnbc").innerHTML; //下拉2
    toppan3 = document.querySelector("#child_Bazaar.cnbc").innerHTML; //下拉3
    toppan4 = document.querySelector("#child_Forge.cnbc").innerHTML; //下拉4

    xlpanfanyi()
    zcpanfanyi()
    for (var i = 0; i < xlpan.length; i++) {
        var regex = new RegExp(xlpan[i], 'g');
        toppan1 = toppan1.replace(regex, xlpanh[i]);
    }
    for (var i = 0; i < xlpan.length; i++) {
        var regex = new RegExp(xlpan[i], 'g');
        toppan2 = toppan2.replace(regex, xlpanh[i]);
    }
    for (var i = 0; i < xlpan.length; i++) {
        var regex = new RegExp(xlpan[i], 'g');
        toppan3 = toppan3.replace(regex, xlpanh[i]);
    }

    for (var i = 0; i < xlpan.length; i++) {
        var regex = new RegExp(xlpan[i], 'g');
        toppan4 = toppan4.replace(regex, xlpanh[i]);
    }
    for (var i = 0; i < torep.length; i++) {
        var regex = new RegExp(torep[i], 'g');
        leftpan = leftpan.replace(regex, repby[i]);
    }



    document.querySelector("#child_Character.cnbc").innerHTML = toppan1;
    document.querySelector("#child_Battle.cnbc").innerHTML = toppan2;
    document.querySelector("#child_Bazaar.cnbc").innerHTML = toppan3;
    document.querySelector("#child_Forge.cnbc").innerHTML = toppan4;
    document.querySelector(".clb").innerHTML = leftpan;
    leftlink();
}
if (document.location.href == 'https://hentaiverse.org/?s=Character&ss=tr') {

    temp = document.querySelector('#trainform > table').rows[1].cells[1].innerHTML.replace('+1% EXP Bonus', '+1%经验值(想快速升级就点)')
    document.querySelector('#trainform > table').rows[1].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[2].cells[1]
    temp = temp.innerHTML.replace('+10% Proficiency Gain Rate', '+10%熟练度获取率(不要点,后期总能追上的)')
    document.querySelector('#trainform > table').rows[2].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[3].cells[1]
    temp = temp.innerHTML.replace('+1 Ability Point', '增加一点技能点(必须点,否则不够用)')
    document.querySelector('#trainform > table').rows[3].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[4].cells[1]
    temp = temp.innerHTML.replace('+1 Mastery Point', '增加一点Mastery(点的都是有钱人)')
    document.querySelector('#trainform > table').rows[4].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[5].cells[1]
    temp = temp.innerHTML.replace('+1% Base Loot Drop Chance', '+1%的物品掉率(4大皆空之1)')
    document.querySelector('#trainform > table').rows[5].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[6].cells[1]
    temp = temp.innerHTML.replace('+1% Base Rare Drop Chance', '+1%稀有物品掉率(4大皆空之2)')
    document.querySelector('#trainform > table').rows[6].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[7].cells[1]
    temp = temp.innerHTML.replace('+5% Base Equipment Drop Chance', '+5%装备基础掉率(4大皆空之3)')
    document.querySelector('#trainform > table').rows[7].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[8].cells[1]
    temp = temp.innerHTML.replace('+10% Base Artifact Drop Chance', '+10%古董掉率(4大皆空之4)')
    document.querySelector('#trainform > table').rows[8].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[9].cells[1]
    temp = temp.innerHTML.replace('Improved Monster Hunger Drain', '降低怪物饥饿速度')
    document.querySelector('#trainform > table').rows[9].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[10].cells[1]
    temp = temp.innerHTML.replace('Improved Monster Morale Drain', '怪物士气不容易降低')
    document.querySelector('#trainform > table').rows[10].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[11].cells[1]
    temp = temp.innerHTML.replace('+1 Battle Scroll Slots', '+1个卷轴携带数')
    document.querySelector('#trainform > table').rows[11].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[12].cells[1]
    temp = temp.innerHTML.replace('+1 Battle Infusion Slots', '+1个魔药携带数')
    document.querySelector('#trainform > table').rows[12].cells[1].innerHTML = temp


    temp = document.querySelector('#trainform > table').rows[13].cells[1]
    temp = temp.innerHTML.replace('+1 Battle Inventory Slots', '+1个道具携带数(请优先升级)')
    document.querySelector('#trainform > table').rows[13].cells[1].innerHTML = temp

    temp = document.querySelector('#trainform > table').rows[14].cells[1]
    temp = temp.innerHTML.replace('+1 Equipment Set', '+1个装备槽(用于换装备,初期不推荐)')
    document.querySelector('#trainform > table').rows[14].cells[1].innerHTML = temp


}

function xlpanfanyi() {
    xlpan = xlpan.concat('>Item Shop Bot')
    xlpanh = xlpanh.concat('>道具机器人')

    xlpan = xlpan.concat('>Equipment Shop')
    xlpanh = xlpanh.concat('>装备店')

    xlpan = xlpan.concat('>Settings')
    xlpanh = xlpanh.concat('>设置')

    xlpan = xlpan.concat('>Character')
    xlpanh = xlpanh.concat('>角色')

    xlpan = xlpan.concat('>Equipment')
    xlpanh = xlpanh.concat('>装备')

    xlpan = xlpan.concat('>Abilities')
    xlpanh = xlpanh.concat('>技能')

    xlpan = xlpan.concat('>Battle Items')
    xlpanh = xlpanh.concat('>战斗道具')

    xlpan = xlpan.concat('>Inventory')
    xlpanh = xlpanh.concat('>物品')

    xlpan = xlpan.concat('>Auras')
    xlpanh = xlpanh.concat('>光环')

    xlpan = xlpan.concat('>The Arena')
    xlpanh = xlpanh.concat('>竞技场(JJC)')

    xlpan = xlpan.concat('>Ring of Blood')
    xlpanh = xlpanh.concat('>浴血擂台(ROB)')

    xlpan = xlpan.concat('>GrindFest')
    xlpanh = xlpanh.concat('>压榨界(GF)')

    xlpan = xlpan.concat('>Item World')
    xlpanh = xlpanh.concat('>道具界(IW)')


    xlpan = xlpan.concat('>Item Shop')
    xlpanh = xlpanh.concat('>道具店')


    xlpan = xlpan.concat('>Monster Lab')
    xlpanh = xlpanh.concat('>女儿之家(怪物实验室)')

    xlpan = xlpan.concat('>MoogleMail')
    xlpanh = xlpanh.concat('>Moogle邮箱')

    xlpan = xlpan.concat('>Training')
    xlpanh = xlpanh.concat('>训练场')

    xlpan = xlpan.concat('>The Shrine')
    xlpanh = xlpanh.concat('>祭坛')

    xlpan = xlpan.concat('>Repair')
    xlpanh = xlpanh.concat('>装备维修')

    xlpan = xlpan.concat('>Weapon Lottery')
    xlpanh = xlpanh.concat('>武器赌场')

    xlpan = xlpan.concat('>Armor Lottery')
    xlpanh = xlpanh.concat('>防具赌场')

    xlpan = xlpan.concat('>Upgrade')
    xlpanh = xlpanh.concat('>装备强化')

    xlpan = xlpan.concat('>Enchant')
    xlpanh = xlpanh.concat('>装备附魔')

    xlpan = xlpan.concat('>Salvage')
    xlpanh = xlpanh.concat('>装备解体')

    xlpan = xlpan.concat('>Reforge')
    xlpanh = xlpanh.concat('>装备重铸')

    xlpan = xlpan.concat('>Soulfuse')
    xlpanh = xlpanh.concat('>装备魂绑')


}

function zcpanfanyi() {

    torep = torep.concat('Health points');
    repby = repby.concat('体力');

    torep = torep.concat('Magic points');
    repby = repby.concat('魔力');

    torep = torep.concat('Spirit points');
    repby = repby.concat('灵力');

    torep = torep.concat('Level');
    repby = repby.concat('等级');

    torep = torep.concat('Difficulty');
    repby = repby.concat('难度');

    torep = torep.concat('Credits');
    repby = repby.concat('绅士币');

    torep = torep.concat('Current exp');
    repby = repby.concat('当前经验');

    torep = torep.concat('To next level');
    repby = repby.concat('升级所需');

    torep = torep.concat('Unassigned exp');
    repby = repby.concat('未分配经验');

    torep = torep.concat('Unspent points');
    repby = repby.concat('未分配点数');


    torep = torep.concat('Stamina')
    repby = repby.concat('精力')

    //难度

    torep = torep.concat('Normal')
    repby = repby.concat('Normal(×1c1)')

    torep = torep.concat('Hard')
    repby = repby.concat('Hard(×2c1.25)')


    torep = torep.concat('Nightmare')
    repby = repby.concat('Nightmare(×4c1.5)')

    torep = torep.concat('Hell')
    repby = repby.concat('Hell(×7c1.75)')

    torep = torep.concat('Nintendo')
    repby = repby.concat('Nintendo(×10c2)')


    torep = torep.concat('IWBTH')
    repby = repby.concat('IWBTH(×15c3)')

    torep = torep.concat('PFUDOR')
    repby = repby.concat('PFUDOR(×20c3)')

}
//右侧状态
function fanyiliebiao() {


    torep = torep.concat(' %')
    repby = repby.concat('%')

    torep = torep.concat('Ether Tap')
    repby = repby.concat('魔力回流')

    torep = torep.concat('Coalesced Mana')
    repby = repby.concat('魔力合流')

    torep = torep.concat('Req: ')
    repby = repby.concat('需要触发')

    torep = torep.concat('on spell hit')
    repby = repby.concat('在魔法命中时发动')

    torep = torep.concat('Elemental Strike')
    repby = repby.concat('属性攻击')

    torep = torep.concat('Bleeding Wound')
    repby = repby.concat('流血攻击')

    torep = torep.concat('Overwhelming Strikes')
    repby = repby.concat('压制攻击')

    torep = torep.concat('Counter-Attack')
    repby = repby.concat('反击')

    torep = torep.concat('Domino Strike');
    repby = repby.concat('多米诺攻击');

    torep = torep.concat('Penetrated Armor');
    repby = repby.concat('破甲');

    torep = torep.concat('on mainhand hit');
    repby = repby.concat('主手攻击命中时发生');

    torep = torep.concat('on offhand hit');
    repby = repby.concat('副手攻击命中时发生');

    torep = torep.concat('Vitals');
    repby = repby.concat('状态加成');



    torep = torep.concat('Offhand Strike');
    repby = repby.concat('副手攻击');

    torep = torep.concat('Stunned')
    repby = repby.concat('眩晕')

    torep = torep.concat('Lasts for')
    repby = repby.concat('持续')

    torep = torep.concat('turns')
    repby = repby.concat('回合')

    torep = torep.concat('turn')
    repby = repby.concat('回合')

    torep = torep.concat('N/A')
    repby = repby.concat('无')

    torep = torep.concat('None')
    repby = repby.concat('无')

    //特殊小词组

    torep = torep.concat('dmg for')
    repby = repby.concat('的伤害并持续')



    //长句子


    torep = torep.concat('Spell Damage Bonus');
    repby = repby.concat('技能伤害加成');

    torep = torep.concat('Effective Proficiency');
    repby = repby.concat('最终熟练度');

    torep = torep.concat('Proc Chances');
    repby = repby.concat('技能发动率');

    torep = torep.concat('Overcharge');
    repby = repby.concat('最大斗气值(Overcharge)');

    // 属性栏

    torep = torep.concat('Primary attributes');
    repby = repby.concat('主属性');

    torep = torep.concat('Strength');
    repby = repby.concat('力量');

    torep = torep.concat('Dexterity');
    repby = repby.concat('灵巧');

    torep = torep.concat('Agility');
    repby = repby.concat('敏捷');

    torep = torep.concat('Endurance');
    repby = repby.concat('体质');

    torep = torep.concat('Intelligence');
    repby = repby.concat('智力');

    torep = torep.concat('Wisdom');
    repby = repby.concat('智慧');

    // 装备熟练度
    torep = torep.concat('Equipment proficiency');
    repby = repby.concat('装备熟练度');

    torep = torep.concat('One-handed');
    repby = repby.concat('单手武器');

    torep = torep.concat('Two-handed');
    repby = repby.concat('双手武器');

    torep = torep.concat('Dual wielding');
    repby = repby.concat('双持武器');

    torep = torep.concat('Staff');
    repby = repby.concat('法杖武器');

    torep = torep.concat('Cloth armor');
    repby = repby.concat('布甲');

    torep = torep.concat('Light armor');
    repby = repby.concat('轻甲');

    torep = torep.concat('Heavy armor');
    repby = repby.concat('重甲');

    // 魔法熟练度
    torep = torep.concat('Magic proficiency');
    repby = repby.concat('魔法熟练度');

    torep = torep.concat('Elemental');
    repby = repby.concat('元素魔法');

    torep = torep.concat('Divine');
    repby = repby.concat('光魔法');

    torep = torep.concat('Forbidden');
    repby = repby.concat('暗魔法');

    torep = torep.concat('Spiritual');
    repby = repby.concat('魂魔法');

    torep = torep.concat('Deprecating');
    repby = repby.concat('减益魔法');

    torep = torep.concat('Supportive');
    repby = repby.concat('增益魔法');

    torep = torep.concat('Curative');
    repby = repby.concat('恢复魔法');

    // 其他状态
    torep = torep.concat('Derived attributes');
    repby = repby.concat('其他属性');

    torep = torep.concat('Base health');
    repby = repby.concat('基础体力');

    torep = torep.concat('Base magic');
    repby = repby.concat('基础魔力');

    torep = torep.concat('Base spirit');
    repby = repby.concat('基础灵力');

    torep = torep.concat('Action speed');
    repby = repby.concat('行动速度');

    torep = torep.concat('Health regen');
    repby = repby.concat('体力恢复率/分');

    torep = torep.concat('Magic regen');
    repby = repby.concat('魔力回复率/分');

    torep = torep.concat('Spirit regen');
    repby = repby.concat('灵力回复率/分');

    torep = torep.concat('on block/parry');
    repby = repby.concat('格挡/招架时发生');

    //  状态栏
    torep = torep.concat('Statistics');
    repby = repby.concat('状态栏');

    torep = torep.concat('Fighting Style');
    repby = repby.concat('持握风格');

    torep = torep.concat('Two-Handed')
    repby = repby.concat('双手')

    torep = torep.concat('One-Handed')
    repby = repby.concat('单手')

    torep = torep.concat('Dualwield')
    repby = repby.concat('双持')

    torep = torep.concat('Niten Ichiryu')
    repby = repby.concat('两天一流')

    torep = torep.concat('Mainhand Damage Type');
    repby = repby.concat('主手打击方式');

    torep = torep.concat('Offhand Damage Type');
    repby = repby.concat('副手打击方式');

    torep = torep.concat('Physical Attack');
    repby = repby.concat('物理攻击数据');

    torep = torep.concat('attack base damage');
    repby = repby.concat('物理基础攻击力');

    torep = torep.concat('magic base damage');
    repby = repby.concat('魔法基础攻击力');

    torep = torep.concat('hit chance');
    repby = repby.concat('命中率');

    torep = torep.concat('crit chance');
    repby = repby.concat('暴击率');

    torep = torep.concat('damage');
    repby = repby.concat('的额外伤害');

    torep = torep.concat('attack speed bonus');
    repby = repby.concat('物理攻速加成');

    torep = torep.concat('Magical Attack');
    repby = repby.concat('魔法攻击数据');

    torep = torep.concat('mana cost modifier');
    repby = repby.concat('魔法消耗修正');


    torep = torep.concat('cast speed bonus');
    repby = repby.concat('魔法攻速加成');

    torep = torep.concat('crushing');
    repby = repby.concat('钝击');

    torep = torep.concat('slashing');
    repby = repby.concat('砍击');

    torep = torep.concat('piercing');
    repby = repby.concat('刺击');

    torep = torep.concat('on hit');
    repby = repby.concat('(命中时判定)');

    torep = torep.concat('Boost');
    repby = repby.concat('加成');

    torep = torep.concat('Damage Mitigations');
    repby = repby.concat('防御效果');

    torep = torep.concat('Damage Mitigation');
    repby = repby.concat('防御效果');

    torep = torep.concat('physical mitigation');
    repby = repby.concat('物理减伤');

    torep = torep.concat('magical mitigation');
    repby = repby.concat('魔法减伤');

    torep = torep.concat('Avoidance');
    repby = repby.concat('回避相关');

    torep = torep.concat('evade chance');
    repby = repby.concat('回避率');

    torep = torep.concat('block chance');
    repby = repby.concat('格挡率');

    torep = torep.concat('parry chance');
    repby = repby.concat('招架率');

    torep = torep.concat('Defense');
    repby = repby.concat('防御数据');

    torep = torep.concat('resist chance');
    repby = repby.concat('魔法免疫');

    torep = torep.concat('Specific Mitigation');
    repby = repby.concat('属性抗性');

    torep = torep.concat('Effective Primary Stats');
    repby = repby.concat('人物属性');

    torep = torep.concat('Compromise');
    repby = repby.concat('装备影响');

    torep = torep.concat('interference');
    repby = repby.concat('干涉');

    torep = torep.concat('burden');
    repby = repby.concat('负重');

    torep = torep.concat('Crushing');
    repby = repby.concat('破碎C');

    torep = torep.concat('Piercing');
    repby = repby.concat('穿刺P');

    torep = torep.concat('Slashing');
    repby = repby.concat('斩击S');

    torep = torep.concat('Fire');
    repby = repby.concat('火');

    torep = torep.concat('Cold');
    repby = repby.concat('冰');

    torep = torep.concat('Elec');
    repby = repby.concat('雷');

    torep = torep.concat('Wind');
    repby = repby.concat('风');

    torep = torep.concat('Holy');
    repby = repby.concat('光');

    torep = torep.concat('Dark');
    repby = repby.concat('暗');

    torep = torep.concat('Soul');
    repby = repby.concat('魂');

    torep = torep.concat('Void');
    repby = repby.concat('空灵');
    //材料
    torep = torep.concat('Cloth');
    repby = repby.concat('布料');

    torep = torep.concat('Leather')
    repby = repby.concat('皮革')

    torep = torep.concat('Wood')
    repby = repby.concat('木材')
}

function rightlink() { //干涉说明
    var rigslink = document.createElement('a');
    rigslink.href = "https://zh.scratchpad.wikia.com/wiki/Interference";
    rigslink.innerHTML = "[\?]";
    rigslink.target = "_blank";
    rigslink.style.color = "red";
    document.querySelector("#rightpane").innerHTML = document.querySelector("#rightpane").innerHTML.replace('干涉', '干涉' + rigslink.outerHTML);
    //负重说明

    var rifzlink = document.createElement('a');
    rifzlink.href = "https://zh.scratchpad.wikia.com/wiki/Burden";
    rifzlink.innerHTML = "[\?]";
    rifzlink.target = "_blank";
    rifzlink.style.color = "red";
    document.querySelector("#rightpane").innerHTML = document.querySelector("#rightpane").innerHTML.replace('负重', '负重' + rifzlink.outerHTML);

}

function leftlink() {}
/*{
var hvchLink = document.createElement('a');
    hvchLink.href = "https://hentaiverse.org/?s=Character&ss=ch";
    hvchLink.innerHTML = "[状]";
    hvchLink.style.color = "red";

var hveqLink = document.createElement('a');
    hveqLink.href = "https://hentaiverse.org/?s=Character&ss=eq";
    hveqLink.innerHTML = "[装]";
    hveqLink.style.color = "red";


var hvabLink = document.createElement('a');
    hvabLink.href = "https://hentaiverse.org/?s=Character&ss=ab";
    hvabLink.innerHTML = "[技]";
    hvabLink.style.color = "red";

var hvitLink = document.createElement('a');
    hvitLink.href = "https://hentaiverse.org/?s=Character&ss=it";
    hvitLink.innerHTML = "[道]";
    hvitLink.style.color = "red";


var hvinLink = document.createElement('a');
    hvinLink.href = "https://hentaiverse.org/?s=Character&ss=in";
    hvinLink.innerHTML = "[包]";
    hvinLink.style.color = "red";


var hvseLink = document.createElement('a');
    hvseLink.href = "https://hentaiverse.org/?s=Character&ss=se";
    hvseLink.innerHTML = "[设]";
    hvseLink.style.color = "red";


var hvauLink = document.createElement('a');
    hvauLink.href = "https://hentaiverse.org/?s=Character&ss=au";
    hvauLink.innerHTML = "光";
    hvauLink.style.color = "red";
//战斗链接

var hvjLink = document.createElement('a');
    hvjLink.href = "https://hentaiverse.org/?s=Battle&ss=ar";
    hvjLink.innerHTML = "[AR]";
    hvjLink.style.color = "red";
var hvbLink = document.createElement('a');
    hvbLink.href = "https://hentaiverse.org/?s=Battle&ss=rb";
    hvbLink.innerHTML = "[RB]";
    hvbLink.style.color = "red";
var hvzLink = document.createElement('a');
    hvzLink.href = "https://hentaiverse.org/?s=Battle&ss=gr";
    hvzLink.innerHTML = "[GF]";
    hvzLink.style.color = "red";

var hviwLink = document.createElement('a');
    hviwLink.href = "https://hentaiverse.org/?s=Battle&ss=iw";
    hviwLink.innerHTML = "[IW]";
    hviwLink.style.color = "red";

//商铺链接

var hveswLink = document.createElement('a');
    hveswLink.href = "https://hentaiverse.org/?s=Bazaar&ss=es";
    hveswLink.innerHTML = "[武]";
    hveswLink.style.color = "red";

var hvisdLink = document.createElement('a');
    hvisdLink.href = "https://hentaiverse.org/?s=Bazaar&ss=is";
    hvisdLink.innerHTML = "[道]";
    hvisdLink.style.color = "red";

var hvabdLink = document.createElement('a');
    hvabdLink.href = "https://hentaiverse.org/?s=Bazaar&ss=ib";
    hvabdLink.innerHTML = "机";
    hvabdLink.style.color = "red";

var hvmlgLink = document.createElement('a');
    hvmlgLink.href = "https://hentaiverse.org/?s=Bazaar&ss=ml";
    hvmlgLink.innerHTML = "[怪]";
    hvmlgLink.style.color = "red";

var hvxtLink = document.createElement('a');
    hvxtLink.href = "https://hentaiverse.org/?s=Character&ss=tr";
    hvxtLink.innerHTML = "[训]";
    hvxtLink.style.color = "red";
var hvjtdLink = document.createElement('a');
    hvjtdLink.href = "https://hentaiverse.org/?s=Bazaar&ss=ss";
    hvjtdLink.innerHTML = "[祭]";
    hvjtdLink.style.color = "red";

var hvdycLink = document.createElement('a');
    hvdycLink.href = "https://hentaiverse.org/?s=Bazaar&ss=fr";
    hvdycLink.innerHTML = "[鍛]";
    hvdycLink.style.color = "red";

var hvymdLink = document.createElement('a');
    hvymdLink.href = "https://hentaiverse.org/?s=Bazaar&ss=mm";
    hvymdLink.innerHTML = "邮";
    hvymdLink.style.color = "red";

var hvvsdLink = document.createElement('a');
    hvvsdLink.href = "https://hentaiverse.org/?s=Bazaar&ss=qs";
    hvvsdLink.innerHTML = "店";
    hvvsdLink.style.color = "red";

    leftlinkDiv = document.createElement("div");
    leftlinkDiv.style.cssText = "text-decoration:none; font-size:15px;color:black; top:-3px; position:relative; text-align:right";
    settings = document.createElement("a");

    settings.onclick = alad
    charapan = document.createElement("a");
    battlpan = document.createElement("a");
    bazaapan = document.createElement("a");
    charapan.innerHTML = hvchLink.outerHTML+hveqLink.outerHTML+hvabLink.outerHTML+hvitLink.outerHTML+hvinLink.outerHTML+hvseLink.outerHTML;
    bazaapan.innerHTML = hveswLink.outerHTML+hvisdLink.outerHTML+hvmlgLink.outerHTML+hvxtLink.outerHTML+hvjtdLink.outerHTML+hvdycLink.outerHTML;
    battlpan.innerHTML = hvjLink.outerHTML+hvbLink.outerHTML+hvzLink.outerHTML+hviwLink.outerHTML;

showlink()
function alad()
{
localStorage.charahhkg==0?localStorage.charahhkg=1:localStorage.charahhkg=0;
showlink();
}
function showlink(){

    if(localStorage.charahhkg==0){
    settings.innerHTML = "打开快捷链接";
    charapan.style.cssText = "display:none;"
    battlpan.style.cssText = "display:none;"
    bazaapan.style.cssText = "display:none;"
    }
    else
    {
    settings.innerHTML = "关闭快捷链接"
    charapan.style.cssText = "display:block;"
    battlpan.style.cssText = "display:block;"
    bazaapan.style.cssText = "display:block;"
    }
    leftlinkDiv.appendChild(charapan);
    leftlinkDiv.appendChild(battlpan);
    leftlinkDiv.appendChild(bazaapan);
    leftlinkDiv.appendChild(settings);
    document.querySelector(".clb").appendChild(leftlinkDiv)
}
}*/

function mainlink() {
    //中文技能wiki链接
    var ablitLink = document.createElement('a');
    ablitLink.href = "https://zh.scratchpad.wikia.com/wiki/Abilities";
    ablitLink.innerHTML = "[技能点]";
    ablitLink.target = "_blank";

    var skillLink = document.createElement('a');
    skillLink.href = "https://zh.scratchpad.wikia.com/wiki/Skills";
    skillLink.innerHTML = "[OC特技]";
    skillLink.target = "_blank";


    var chajianLink = document.createElement('a');
    chajianLink.href = "https://tieba.baidu.com/p/3703712811";
    chajianLink.innerHTML = "[贴吧卖场]";
    chajianLink.target = "_blank";


    var chajianLink2 = document.createElement('a');
    chajianLink2.href = "https://tieba.baidu.com/p/3700312787";
    chajianLink2.innerHTML = "[贴吧求购]";
    chajianLink2.target = "_blank";


    var chajianLink3 = document.createElement('a');
    chajianLink3.href = "https://tieba.baidu.com/f/good?kw=hentaiverse&ie=utf-8";
    chajianLink3.innerHTML = "[贴吧精品贴]";
    chajianLink3.target = "_blank";

    var guanfangchajianLink = document.createElement('a');
    guanfangchajianLink.href = "https://ehwiki.org/wiki/HentaiVerse_Scripts_%26_Tools";
    guanfangchajianLink.innerHTML = "[官方插件](英文)";
    guanfangchajianLink.target = "_blank";

    var guanfangchajianLink2 = document.createElement('a');
    guanfangchajianLink2.href = "https://tieba.baidu.com/p/3108588733";
    guanfangchajianLink2.innerHTML = "[贴吧脚本楼]";
    guanfangchajianLink2.target = "_blank";

    var guanfangchajianLink3 = document.createElement('a');
    guanfangchajianLink3.href = "https://e-hentai.org/dmspublic/karma.php?u=1244725";
    guanfangchajianLink3.innerHTML = "[给作者加K(^-^)]";
    guanfangchajianLink3.target = "_blank";

    //速度说明
    var actspd = document.createElement('a');
    actspd.href = "https://zh.scratchpad.wikia.com/wiki/Action_Speed";
    actspd.innerHTML = "[行动速度]";
    actspd.target = "_blank"

    //装备wiki
    var equwiki = document.createElement('a'); //装备说明
    equwiki.href = "https://zh.scratchpad.wikia.com/wiki/Equipment";
    equwiki.innerHTML = "[装备]";
    equwiki.target = "_blank"

    var sldwiki = document.createElement('a'); //装备熟练度
    sldwiki.href = "https://zh.scratchpad.wikia.com/wiki/Proficiencies";
    sldwiki.innerHTML = "[熟练度]";
    sldwiki.target = "_blank"
    //魔法wiki
    var magwiki = document.createElement('a');
    magwiki.href = "https://zh.scratchpad.wikia.com/wiki/Spells";
    magwiki.innerHTML = "[魔法]";
    magwiki.target = "_blank"


    var CSLink = document.createElement('a');
    CSLink.href = "https://zh.scratchpad.wikia.com/wiki/Character_Stats";
    CSLink.innerHTML = "[主要属性]";
    CSLink.target = "_blank";

    var ndLink = document.createElement('a');
    ndLink.href = "https://zh.scratchpad.wikia.com/wiki/HentaiVerse_Settings";
    ndLink.innerHTML = "[难度]";
    ndLink.target = "_blank";

    var twLink = document.createElement('a');
    twLink.href = "https://tieba.baidu.com/p/3706976851";
    twLink.innerHTML = "贴吧提问楼";
    twLink.target = "_blank";
    twLink.style.color = "red";

    var twLink1 = document.createElement('a');
    twLink1.href = "https://forums.e-hentai.org/index.php?showtopic=176802";
    twLink1.innerHTML = "官方灌水(中文)";
    twLink1.target = "_blank";
    twLink1.style.color = "red";

    var twLink2 = document.createElement('a');
    twLink2.href = "https://forums.e-hentai.org/index.php?showforum=77";
    twLink2.innerHTML = "官方论坛WTS";
    twLink2.target = "_blank";
    twLink2.style.color = "red";


    youcelianjie = document.createElement("stat");
    youcelianjie.onclick = youcekaiguan

    function youcekaiguan() {
        localStorage.yckguan == 0 ? localStorage.yckguan = 1 : localStorage.yckguan = 0;
        if (localStorage.yckguan == 0) { quicklink.innerHTML = '';
            youcelianjie.innerHTML = "打开连接"; } else {
            quicklink.innerHTML = ' 界面汉化<br>Wiki:' + '<br>' + CSLink.outerHTML + '<br>' + skillLink.outerHTML + '<br>' + magwiki.outerHTML + '<br>' + sldwiki.outerHTML + '<br>' + equwiki.outerHTML + '<br>' + ablitLink.outerHTML + '<br>' + ndLink.outerHTML + '<br>' + actspd.outerHTML + '<br>贴吧连接:<br>' + twLink.outerHTML + '<br>' + chajianLink.outerHTML + '<br>' + chajianLink2.outerHTML + '<br>' + chajianLink3.outerHTML + '<br>插件及脚本:<br>' + guanfangchajianLink.outerHTML + '<br>' + guanfangchajianLink2.outerHTML + '<br>' + guanfangchajianLink3.outerHTML;
            youcelianjie.innerHTML = "关闭连接";
        }
    }
    if (localStorage.yckguan == 0) {
        youcelianjie.innerHTML = "打开连接";
        youcelianjie.style.cssText = "font-size:15px;color:red; position:absolute;top:100px; left:1250px  ;text-align:left";
        quicklink = document.createElement("stat");
        quicklink.style.cssText = "font-size:15px;color:black; position:absolute; top:120px; left:1250px;text-align:left";
        quicklink.innerHTML = ''
        document.body.appendChild(quicklink);
        document.body.appendChild(youcelianjie);
    } else {
        youcelianjie.innerHTML = "关闭连接";
        youcelianjie.style.cssText = "font-size:15px;color:red; position:absolute; top:100px; left:1250px ;text-align:left";
        quicklink = document.createElement("stat");
        quicklink.style.cssText = "font-size:15px;color:black; position:absolute; top:120px; left:1250px;text-align:left";
        quicklink.innerHTML = ' 界面汉化V2<br>Wiki常用<br>:' + '<br>' + CSLink.outerHTML + '<br>' + skillLink.outerHTML + '<br>' + magwiki.outerHTML + '<br>' + sldwiki.outerHTML + '<br>' + equwiki.outerHTML + '<br>' + ablitLink.outerHTML + '<br>' + ndLink.outerHTML + '<br>' + actspd.outerHTML + '<br>相关链接:<br>' + twLink.outerHTML + '<br>' + twLink1.outerHTML + '<br>' +
            twLink2.outerHTML + '<br>' + chajianLink.outerHTML + '<br>' + chajianLink2.outerHTML + '<br>' + chajianLink3.outerHTML + '<br>插件及脚本:<br>' + guanfangchajianLink.outerHTML + '<br>' + guanfangchajianLink2.outerHTML + '<br>' + guanfangchajianLink3.outerHTML
        document.body.appendChild(quicklink);
        document.body.appendChild(youcelianjie);
    }
}
