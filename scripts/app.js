
console.log('in-sanity check');

var carouselIndex= 0, offset= 30;

// ease-in-out cubic
function easeInOutCubic(t, startVal, offsetVal, d) { 
    t /= d/2;
	if (t < 1) return startVal+offsetVal/2*t*t*t;
	t -= 2;
    return startVal+ offsetVal/2*(t*t*t + 2);
}

// ease-in-out quadratic
function easeInOutQuad(t, startVal, offsetVal, d) {
	t /= d/2;
	if (t < 1) return startVal+offsetVal/2*t*t;
	t--;
	return startVal-offsetVal/2*(t*(t-2)-1);
};

// move frame with animation
function moveFrame(startTime,startPos,diff,duration) {
    var timestamp= new Date().getTime();
    var runTime= timestamp-startTime;
    window.scrollTo(0,easeInOutCubic(runTime,startPos,diff,duration));

    if (runTime < duration){ 
        requestAnimationFrame(function(timestamp){ 
            moveFrame(startTime,startPos,diff,duration);
        });
    }
}

// jump to section with animation
function jumpToTab(elem,index) {
    //console.log(index);
    var currPosTop= document.documentElement.scrollTop;
    var diff= elem.offsetTop-offset-offset-currPosTop;
    var duration= 1000;
    
    requestAnimationFrame(function(timestamp){
        var startTime= new Date().getTime();
        moveFrame(startTime, currPosTop, diff, duration); 
    });
}

function carouselSlide(next) {
    var projects= document.getElementsByClassName('project');
    if (next) {
        carouselIndex= carouselIndex+1 >= projects.length ? 0 : carouselIndex+1;
    } else {
        carouselIndex= carouselIndex-1 < 0 ? projects.length-1 : carouselIndex-1;
    }
    console.log(carouselIndex);
    jumpToArticle(projects[carouselIndex],carouselIndex);
}

// jump to article carousel 
function jumpToArticle(elem,index) {
    var activeProj= document.getElementsByClassName('proj-active')[0];
    var activeDot= document.getElementsByClassName('dot-selected')[0];
    var slideDots= document.getElementsByClassName('dot');
    carouselIndex= index;
    activeProj.setAttribute('class','project');
    activeDot.setAttribute('class','dot');
    elem.setAttribute('class','project proj-active');
    slideDots[carouselIndex].setAttribute('class','dot dot-selected');
}

// chose Nav Tab when scroll
function chooseNavbar() {
    var currTop= document.documentElement.scrollTop;
    var sections= document.getElementsByTagName('section');
    var navTab= document.getElementsByClassName('nav-bar')[0].getElementsByTagName('li');
    for (var i=0;i<navTab.length;i++) {
        var proportion= 0.5;
        if (sections[i].offsetTop-sections[i].offsetHeight*proportion <= currTop && sections[i].offsetTop+(1-proportion)*sections[i].offsetHeight >=currTop) {
            navTab[i].setAttribute('class','');
            navTab[i].setAttribute('class','active');
        } else {
            navTab[i].setAttribute('class','');
        }
    }
}



function showText(target,textArr,index,timeOut) {
    if (index>= textArr.length) { return; }
    target.innerHTML+= textArr[index];
    setTimeout(function(){
        showText(target,textArr,index+1,timeOut);
    },timeOut);
}



window.onload= function(e) {
    
    // event listener for nav-tab when clicked
    var sections= document.getElementsByTagName('section');
    var navTab= document.getElementsByClassName('nav-bar')[0].getElementsByTagName('li');
    for (var i=0;i<navTab.length;i++) {
        (function(index) {
            navTab[i].addEventListener('click',function(){
                //for (var i=0;i<navTab.length;i++) { navTab[i].setAttribute('class',''); } navTab[index].setAttribute('class','active');
                jumpToTab(sections[index],index);
            });
        })(i);
    }

    // find out which nav-tab currently in
    document.addEventListener('scroll',chooseNavbar);

    // hamburger icon when resize
    document.getElementsByClassName('hamburger')[0].addEventListener('click',function(e){
        e.preventDefault();
        var navbar= document.getElementsByClassName('nav-bar')[0];
        //console.log(navbar.className);
        if (navbar.className==='nav-bar') {
            navbar.className+= ' responsive';
        } else {
            navbar.className= 'nav-bar';
        }
        //console.log(navbar.className);
    });

    // create prev, next buttons for carousel
    document.getElementsByClassName('prev')[0].addEventListener('click',function(){
        carouselSlide(false);
    });
    document.getElementsByClassName('next')[0].addEventListener('click',function(){
        carouselSlide(true);
    });

    // add event listener for carousel dots
    var carouselDots= document.getElementsByClassName('dot');
    for (var i=0;i<carouselDots.length;i++) {
        (function(index){
            carouselDots[i].addEventListener('click',function(){
                jumpToArticle(document.getElementsByClassName('project')[index],index);
            })
        })(i);
    }

    // learn more buttons event listener onclick
    var learnMoreBtns= document.getElementsByClassName('learn-more');
    for (var i=0;i<learnMoreBtns.length;i++) {
        (function(index){
            // create modal page
            learnMoreBtns[i].addEventListener('click',function(){
                var parent= this.parentNode;
                var imgSrc= parent.getElementsByTagName('img')[0].src;
                var modal= document.getElementsByClassName('modal')[0];
                var closeBtn= modal.getElementsByClassName('close')[0];
                var projDetails= parent.getElementsByClassName('proj-details')[0];
                var newImgNode= document.createElement('img');
                newImgNode.src= imgSrc;
                projDetails.insertBefore(newImgNode,projDetails.getElementsByTagName('h3')[0]);
                projDetails.style.display= 'block';
                modal.style.display= 'block';
                closeBtn.addEventListener('click',function(){
                    modal.style.display= 'none';
                    projDetails.style.display= 'none';
                    projDetails.removeChild(projDetails.getElementsByTagName('img')[0]);
                });
                
            });
        })(i);
    }

    
};
