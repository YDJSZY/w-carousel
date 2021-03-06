/**
 * Created by luwenwe on 2017/7/4.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.Carousel  = factory());
}(this,function () {
    var Carousel = function (options) {
        this.defaultOptions = {"automaticPlay":true,"targetId":"myCarousel","delay":3000};
        this.options = Object.assign(this.defaultOptions,options);
        this.targetCarousel = document.getElementById(this.options.targetId);
        this.carouselUl = this.targetCarousel.children[0];
        this.carouselLi = this.targetCarousel.children[0].children;
        this.render();
    }

    Carousel.prototype = {
        constructor:Carousel,
        render:function () {
            var self = this,automaticPlayTimer = null,timer_out = null;
            var carouselLi = this.carouselLi;
            var carouselLiLen = carouselLi.length;
            var spot = document.createElement("div");
            this.targetCarousel.setAttribute("class","w-carousel-container");
            this.targetCarousel.style.width = this.options.carouselWidth;
            this.targetCarousel.style.height = this.options.carouselHeight;
            this.carouselUl.setAttribute("class","w-carousel-u");

            var func = function () {
                var element = this;
                switchAutomaticPlay()
                action(this);
            };

            for(var i = 0,l = carouselLi.length; i < l;i++){
                carouselLi[i].setAttribute("data-index",i+1);
                if(i==0){
                    carouselLi[i].setAttribute("class","current");
                    carouselLi[i].setAttribute("data-position","current");
                }else if(i==1){
                    carouselLi[i].setAttribute("class","next");
                    carouselLi[i].setAttribute("data-position","next");
                }else if(i==l-1) {
                    carouselLi[i].setAttribute("class", "prev");
                    carouselLi[i].setAttribute("data-position", "prev");
                }
                carouselLi[i].addEventListener("click",func,false)
            };

            var createSpot = function () {
                spot.setAttribute("class","spot");
                var oFragment = document.createDocumentFragment();
                for(var i = 0;i < carouselLiLen; i++){
                    var span = document.createElement("span");
                    if(i==0){
                        span.setAttribute("class","spot-active");
                    }
                    span.setAttribute("data-index",i+1);
                    span.addEventListener("click",function(){
                        var index = parseInt(this.getAttribute("data-index"));
                        spotClick(index);
                    },false)
                    oFragment.appendChild(span);
                }
                spot.appendChild(oFragment);
                self.targetCarousel.appendChild(spot);
            };
            createSpot();

            var findCarouselLiByIndex = function (index){
                for(var i = 0,l = carouselLiLen; i < l;i++){
                    if(parseInt(carouselLi[i].getAttribute("data-index"))==index) return carouselLi[i];
                }
            };

            var findCarouselLiByCls = function (cls) {
                for(var i = 0,l = carouselLiLen; i < l;i++){
                    if(carouselLi[i].getAttribute("class")==cls){
                        return carouselLi[i];
                    }
                }
            };

            var switchAutomaticPlay = function () {
                if(!self.options.automaticPlay) return;
                clearInterval(automaticPlayTimer);
                clearTimeout(timer_out);
                timer_out = setTimeout(function (){
                    setPlay();
                },4000)
            }

            var spotClick = function (index) {
                switchAutomaticPlay();
                var currentIndex = parseInt(findCarouselLiByCls("current").getAttribute("data-index"));
                if(currentIndex==index) return;
                var startElement = findCarouselLiByIndex(index);
                var startElementIndex = index;
                var next = findCarouselLiByCls("next");
                var nextIndex = parseInt(next.getAttribute("data-index"));
                var prev = findCarouselLiByCls("prev");
                var prevIndex = parseInt(prev.getAttribute("data-index"));
                var leftDistanceIndex = Math.abs(prevIndex-index);
                var rightDistanceIndex = Math.abs(nextIndex-index);
                var totalDistance,timer = null;
                if(rightDistanceIndex <= leftDistanceIndex){
                    totalDistance = rightDistanceIndex+1;
                    timer = setInterval(function () {
                        if(totalDistance==0){
                            clearInterval(timer);
                            switchSpotActive(index);
                            return;
                        }
                        action(findCarouselLiByCls("next"),"fromSpot");
                        totalDistance--;
                    },40)
                }else{
                    totalDistance = leftDistanceIndex+1;
                    timer = setInterval(function () {
                        if(totalDistance==0){
                            clearInterval(timer);
                            switchSpotActive(index);
                            return;
                        }
                        action(findCarouselLiByCls("prev"),"fromSpot");
                        totalDistance--;
                    },40)
                }
            };

            var action = function (startElement,fromSpot) {
                var startElement = startElement;
                var position = startElement.getAttribute("data-position");
                if(position=="current") return;
                var index = parseInt(startElement.getAttribute("data-index"));
                var current = findCarouselLiByCls("current");
                var prev = findCarouselLiByCls("prev");
                var next = findCarouselLiByCls("next");
                if(position=="next"){
                    current.setAttribute("class","prev");
                    current.setAttribute("data-position","prev");
                    prev.setAttribute("class","hide");
                    prev.setAttribute("data-position","");
                    startElement.setAttribute("class","current");
                    startElement.setAttribute("data-position","current");
                    if(index==carouselLiLen){
                        var l = findCarouselLiByIndex(1);
                    }else{
                        var l = findCarouselLiByIndex(index+1);
                    }
                    l.setAttribute("class","next");
                    l.setAttribute("data-position","next");
                }
                if(position=="prev"){
                    current.setAttribute("class","next");
                    current.setAttribute("data-position","next");
                    next.setAttribute("class","hide");
                    next.setAttribute("data-position","");
                    startElement.setAttribute("class","current");
                    startElement.setAttribute("data-position","current");
                    if(index==1){
                        var l = findCarouselLiByIndex(carouselLiLen);
                    }else{
                        var l = findCarouselLiByIndex(index-1);
                    }
                    l.setAttribute("class","prev");
                    l.setAttribute("data-position","prev");
                }
                if(fromSpot) return;
                switchSpotActive(index);
            };

            var switchSpotActive = function (index) {
                for(var i = 0,l = spot.children.length;i < l; i++){
                    if(parseInt(spot.children[i].getAttribute("data-index"))==index){
                        spot.children[i].setAttribute("class","spot-active")
                    }else{
                        spot.children[i].setAttribute("class","");
                    }
                }
            };

            var setPlay = function () {
                automaticPlayTimer = setInterval(function (){
                    action(findCarouselLiByCls("next"));
                },self.options.delay)
            };

            if(this.options.automaticPlay) setPlay();
        }
    }

    return Carousel;
}))