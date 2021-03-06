/*
	compatible: 14.9.2016
*/
class ChatViewer{
 				constructor(title, myName, sendMessage){
 					this._myName		= myName;
 					this._title 		= title;
 					this._createHTML();
 					this._isShifDown	= false;
 					this._textC 		= document.getElementById("textC");
 					this._histC 		= document.getElementById("histC");
 					this._chatW			= document.getElementById("chatW");
 					this._histW 		= document.getElementById("hist");
 					this._sendMessage 	= sendMessage;
 					this._init(document.getElementById("headC"));
 					this.hide();
 					this.toggleChat();
 				}

 				_createHTML(){
 					var result = '<div id="chatW"><div id="headC"><span id="chatTitle">';
 					result += this._title + '</span><div class="headerButton" id="hideChat">×</div>';
 					result += '<div class="headerButton" id="toggleChat">-</div>';
 					result += '<div class="headerButton" id="clearChat">C</div></div>';
 					result += '<div id="histC"><div id="hist"></div></div>';
 					result += '<div id="textC" contenteditable="true"></div></div>';

 					var el = document.createElement("div");
 					el.innerHTML = result;
 					document.body.appendChild(el.firstChild);
 					//document.body.innerHTML += result;
 				}

 				hide(){
 					this._chatW.style.display = "none";

 					if(typeof Project !== "undefined" && Project.isMobile){
	 					var canvases = document.getElementsByClassName("canvas");
	 					for(var i in canvases)
	 						canvas.classList.remove("offset");
 					}
 				}

 				show(){
 					this._chatW.style.display = "block";

 					if(typeof Project !== "undefined" && Project.isMobile){
	 					var canvases = document.getElementsByClassName("canvas");
	 					for(var i in canvases)
	 						canvas.classList.add("offset");
 					}
 				}

 				_init(headC){
 					document.getElementById("chatTitle").innerHTML = this._title;
 					document.getElementById("toggleChat").onclick = () => this.toggleChat();
 					document.getElementById("clearChat").onclick = () => this._histW.innerHTML = "";
 					document.getElementById("hideChat").onclick = () => this.hide();
 					headC.onmousedown = ee => {
						if(ee.target != headC)
							return false;
						var backup = window.onmousemove;
						window.onmousemove = e => this._check(e, ee, this._chatW);
						window.onmouseup = e => window.onmousemove = backup;
					};

		 			this._textC.onkeydown = e => {
		 				if(e.keyCode === SHIFT_KEY)
							this._isShifDown = true;

						e.target.onkeyup = e => {
			 				if(e.keyCode === SHIFT_KEY)
			 					this._isShifDown = false;
			 				this._updateData();
			 			};

		 				if(e.keyCode == ENTER_KEY && !this._isShifDown){
		 					this._prepareMessage();	
		 					return false;
		 				}
		 			};
 				}

 				_updateData(size = true, offset = true){
	 				if(size)
	 					this._histC.style.height = (this._chatW.offsetHeight - this._textC.offsetHeight - 30) + "px";

	 				if(offset)
						this._histC.scrollTop = this._histC.scrollHeight - this._histC.clientHeight;
	 			}

	 			_check(e, f, g){
					var h = (a, b, c, d) => (Math.max(Math.min(a - b, c - d), 0)) + "px";
					g.style.top = h(e.clientY, f.offsetY, window.innerHeight, g.offsetHeight);
					//g.style.top = h(e.touches ? e.touches[0].clientY : e.clientY, f.touches ? f.touches[0].pageY : f.offsetY, window.innerHeight, g.offsetHeight);
					g.style.left = h(e.clientX, f.offsetX, window.innerWidth, g.offsetWidth);
					//g.style.left = h(e.touches ? e.touches[0].clientX : e.clientX, f.touches ? f.touches[0].pageX : f.offsetX, window.innerWidth, g.offsetWidth);
				}

				toggleChat(){
					var toggle = (height, display) =>{
							this._chatW.style.height  = height + "px";
							this._histC.style.display = display;
							this._textC.style.display = display;
					};
					this._chatW.style.height == "28px" ? toggle(404, "block") : toggle(28, "none");
				}

				recieveMessage(msg, sender){
	 				var string;
	 				if(this._myName != sender){
	 					string = '<div class="messageC">';
	 					string += '<div class ="senderName">' + getFormattedDate() + ' - ';
	 					string += sender + ':</div>';
	 				}
	 				else{
	 					string = '<div class="messageC myMessage">';
	 				}
	 				
	 				string += '<div class="messageText">' + msg + '</div></div>';

	 				this._histW.innerHTML += string;

	 				this._updateData(false);
	 			}

	 			_prepareMessage(){
	 				var context = this._textC.innerHTML;
	 				this._sendMessage(context);

	 				this._textC.innerHTML = "";
	 			}
 			}