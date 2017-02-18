    var oA;
    var json={
    	die:'sound/die.mp3',
    	start:'sound/startSound.mp3',
    	boost:'sound/boost.mp3',
    	thrust:'sound/cc.mp3',
    	game:'sound/gameBackground.mp3'    	    
    };
    var oB=new Buzz(json);
    function Buzz(json){
    	this.json=json;
    	this.arr=[];
    };
    Buzz.prototype.sound=function(json){
    	for(var id in json){
    		oA=new Audio;
    		oA.src=json[id];
			oA.play();
			this.arr.push(oA);			
    	};       	
	};
    Buzz.prototype.sing=function(name){
    	    oA=new Audio;
    		oA.src=json[name];
    		if(!Mute){
    			oA.volume=0.3;
    		}else{
    			oA.volume=0;
    		}
			oA.play();
			this.arr.push(oA);	  
    };
    Buzz.prototype.muteToggle=function(){ 
    	if(!Mute){
    		for(var i=0; i<this.arr.length; i++){
		  		this.arr[i].volume=0;
		  	}
    	}else{
    		for(var i=0; i<this.arr.length; i++){
		  		this.arr[i].volume=0.3;
		  	}
    	}
    };
    Buzz.prototype.cancel=function(name){
    	for (var i=0; i<this.arr.length;i++) {
    		if(this.arr[i].src.indexOf(this.json[name])!=-1){
    			this.arr[i].pause();
    			this.arr.splice(i,1);          
    		}
    	}
    };
    Buzz.prototype.singLoop=function(name){
    	oA=new Audio;
    	oA.src=json[name];
    	if(!Mute){
    		oA.volume=0.3;
    	}else{
    	    oA.volume=0;	
    	}    	
    	oA.loop='loop';
    	oA.play();
		this.arr.push(oA);		
    };
    



















