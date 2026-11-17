(function(){
"use strict";
var SONGS=window.SONGS||[];
var KEY="karol-learned-v1";
function load(){try{var r=localStorage.getItem(KEY);return r?JSON.parse(r):{}}catch(e){return {}}}
function save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
var learned=load();
var withVideo=SONGS.filter(function(s){return !!s.v});
var totalSongs=withVideo.length;
var current=-1;
function $(id){return document.getElementById(id)}
function learnedCount(){var c=0;withVideo.forEach(function(s){if(learned[s.n])c++});return c}
function renderProgress(){
  var c=learnedCount();
  $("learnedCount").textContent=c;
  $("totalCount").textContent=totalSongs;
  $("progressFill").style.width=(totalSongs?Math.round(c/totalSongs*100):0)+"%";
}
function renderList(){
  var box=$("listView");box.innerHTML="";
  SONGS.forEach(function(s,i){
    var row=document.createElement("div");
    row.className="song-row"+((s.v&&learned[s.n])?" learned":"");
    var badge=s.segment?'<span class="badge">מקטע הופעה</span>':(s.lyrics?'<span class="badge">מילים על המסך</span>':'');
    row.innerHTML='<div class="num">'+s.n+'</div>'+
      '<div class="info"><div class="title" dir="ltr">'+s.t+'</div><div class="artist" dir="ltr">'+s.a+'</div>'+badge+'</div>'+
      '<div class="check">'+(s.v?(learned[s.n]?"✅":"🎧"):"🎭")+'</div>';
    row.addEventListener("click",function(){openSong(i)});
    box.appendChild(row);
  });
}
function openSong(i){
  current=i;var s=SONGS[i];
  $("listView").hidden=true;$("songView").hidden=false;
  $("songNum").textContent="#"+s.n;
  $("songTitle").textContent=s.t;
  $("songArtist").textContent=s.a;
  $("songAbout").textContent=s.about;
  var vw=$("videoWrap");
  if(s.v){
    vw.innerHTML='<iframe src="https://www.youtube.com/embed/'+s.v+'" title="'+s.t+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  }else{
    vw.innerHTML='<div class="no-video">'+s.t+'<br>מקטע בהופעה - אין סרטון רשמי נפרד.<br>תכירי אותו בשידור חי!</div>';
  }
  var note=$("lyricsNote");
  if(s.v&&s.lyrics)note.textContent="הסרטון מציג את המילים בספרדית תוך כדי השיר - אפשר לשיר איתו!"+(s.note?" "+s.note:"");
  else if(s.v)note.textContent="לשיר הזה לא מצאתי סרטון שמציג את המילים - זה הסרטון הרשמי, להאזנה ותרגול בעל פה.";
  else note.textContent="";
  updateLearnedBtn();updateNav();
  window.scrollTo(0,0);
}
function updateLearnedBtn(){
  var s=SONGS[current];var b=$("learnedToggle");
  if(!s.v){b.hidden=true;return}
  b.hidden=false;
  if(learned[s.n]){b.classList.add("on");b.textContent="✔ יודעת!"}
  else{b.classList.remove("on");b.textContent="סמני: יודעת את השיר"}
}
function updateNav(){
  $("prevBtn").disabled=(current<=0);
  $("nextBtn").disabled=(current>=SONGS.length-1);
}
function closeSong(){
  $("videoWrap").innerHTML="";
  $("songView").hidden=true;$("listView").hidden=false;
  renderList();renderProgress();
}
$("backBtn").addEventListener("click",closeSong);
$("prevBtn").addEventListener("click",function(){if(current>0)openSong(current-1)});
$("nextBtn").addEventListener("click",function(){if(current<SONGS.length-1)openSong(current+1)});
$("learnedToggle").addEventListener("click",function(){
  var s=SONGS[current];if(!s.v)return;
  learned[s.n]=!learned[s.n];
  if(!learned[s.n])delete learned[s.n];
  save(learned);updateLearnedBtn();renderProgress();
});
$("resetBtn").addEventListener("click",function(){
  if(confirm("לאפס את כל הרשימה? כל ה-V יימחקו.")){learned={};save(learned);renderList();renderProgress()}
});
renderList();renderProgress();
var h=(location.hash||"").match(/^#song=(\d+)$/);
if(h){var idx=SONGS.findIndex(function(x){return x.n===+h[1]});if(idx>=0)openSong(idx)}
window.addEventListener("hashchange",function(){
  var m=(location.hash||"").match(/^#song=(\d+)$/);
  if(m){var i=SONGS.findIndex(function(x){return x.n===+m[1]});if(i>=0)openSong(i)}
  else closeSong();
});
})();
