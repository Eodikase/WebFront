// popstate 이벤트 핸들러 등록
window.addEventListener("popstate", handleBackButton);
/* 브라우저 뒤로가기 버튼이 눌렸을 때 실행되는 함수 */
function handleBackButton() {
  var currentURL = window.location.href; // 현재 페이지의 URL
  // 뒤로가기 이후 현재 페이지의 URL이 ' '인 경우 ' ' 페이지로 이동
  if (currentURL === "https://www.eodikase.com/html/course.html") {
    window.location.replace("https://www.eodikase.com/html/course.html");
  } else if (currentURL === "http://127.0.0.1:5500/html/course.html") {
    window.location.replace("http://127.0.0.1:5500/html/course.html");
  }
}

// 현재 페이지의 검색어 추출하는 함수
function getCurrentKeyword() {
  var queryString = window.location.search;

  var keywordMatch = queryString.match(/(?:\?|&)keyword=([^&]+)/);

  return keywordMatch ? decodeURIComponent(keywordMatch[1]) : "";
}

// 피드 화면 만드는 함수
function loadFeedContent(courseData) {
  const feed = document.querySelector(".feed");
  courseData.forEach((content) => {
    // 유저가 프로필 이미지를 설정해놓지 않을 경우 기본 이미지로 설정
    let profileImage;
    if (content.memberProfileImage == null) {
      profileImage = "../img/userImg-removebg.svg";
    } else {
      profileImage = content.memberProfileImage;
    }

    const courseId = content.courseId;
    const nickname = content.nickname;

    const createdTime = calculateTime(content.createdDate);
    const courseName = content.courseName;
    const courseDescription = content.courseDescription;

    const imageUrl = content.courseItems[0].imageUrl; // 이후 배열 처리

    feed.innerHTML += `
                    <a href="#/${courseId}" onclick="detail(${courseId});" style="text-decoration-line: none">
                        <div class="card">
                            <div>
                                <img class="card-profile-img" src=${profileImage}>
                                <div class="card-user-nickname"><div class="user-name">${nickname}</div>
                                    <p class="card-time"><small class="text-muted">${createdTime}</small>
                                        </p>
                                </div>
                            </div>
                            <h5 class="card-title">${courseName}</h5>
                            <p class="card-desc">${courseDescription}</p>
                            <img src= ${imageUrl} class="card-img-bottom">
                         </div> 
                         <hr>
                    </a>
                `;
  });
}

function selectRegion(region) {
  selectedRegion = region; // 지역 저장
  axios
    .get(`https://eodikase.com/v1/courses/region/${region}`)
    .then(function (response) {
      const feed = document.querySelector(".feed");
      feed.innerHTML = "";
      loadFeedContent(response.data.data.content);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function init() {
  axios
    .get("https://eodikase.com/v1/courses")
    .then(function (response) {
      const feed = document.querySelector(".feed");
      feed.innerHTML = "";
      loadFeedContent(response.data.data.content); // 성공시 피드 화면 만드는 함수 실행
    })
    .catch(function (error) {
      console.log(error);
    });
}

// course detail로 넘어가는 함수(라우팅 유사 기능 구현)
function detail(courseId) {
  const container = document.querySelector(".container");
  const feed_section = document.querySelector(".feed-section");

  feed_section.innerHTML = "";
  feed_section.style.height = "0px";
  container.innerHTML = "";
  container.innerHTML += `
                <div class="header">
                    <div class="navbar">
                        <ul class="navbar-ul" style="width: 100%; height: 65px; display: flex; flex-direction: row; justify-content: space-evenly; align-items: center; margin: 0">
                            <li><a href="../html/index.html"> <img class="logo-img" src="../img/app-logo.png" style="width: auto; height: auto"></a></li>
                            <li><a href="../html/index.html" style="text-decoration: none; color:#551A8B; font-family: Pretendard, 'Noto Sans KR', sans-serif">
                                <h5 style="margin: 0; font-weight: 650; ">어디카세</h5></a></li>
                            <li><a href="course.html" style="text-decoration: none; color:#551A8B; font-family: Pretendard, 'Noto Sans KR', sans-serif"> <h5 style="margin: 0; font-weight: 650; ">코스 둘러보기</h5> </a></li>
                            <li class="search">
                                <form action="../html/search.html" method="get">
                                    <input class="search-input" type="search" name="keyword" placeholder="코스를 검색해보세요">
                                </form>
                            </li>
                        </ul>
                    </div>
                    <hr>
                    <div class="back">
                        <a href="../html/course.html">
                          <i class="fa-solid fa-arrow-left fa-2x"></i>
                         </a>
                    </div>
                    <div class="img-banner-course">
                        <div class="store-img"></div>
                        <div class="store-img"></div>
                        <div class="store-img"></div>
                    </div>
                </div>
                <div class="course-detail-course">
                    <div class="user-info">
                        <div class="profile-img"></div>
                        <div class="user-info-right-side">
                            <div class="user-nickname"></div>
                            <div class="region" style="margin: 3px 0 0 10px;"></div>
                        </div>
                    </div>
                    <div class="course-info">
                        <div class="course-name" style="margin:0 0 0 0;"></div>
                        <div class="course-categories"></div>
                    </div>
                    <div class="map-info">
                        <div class="map-info-text">
                            <h1>코스 정보</h1>
                        </div>
                        <div id="map" style="width:100%; height:700px;"></div>
                    </div>
                    <div class="more">
                        <div class="section-wrap">
                            <div class="section-text">
                                <p class="text">코스 내용을 상세하게 보고싶다면 <br>어디카세 앱을 다운받아 보세요!</p>
                            </div>
                        </div>
                        <div class="section-wrap">
                            <input class="move-button" type="button" onclick="location" href='#'
                                value=" 앱 다운하러 가기">
                        </div>
                    </div>
                    <div class="footer">
                        <ul class="top-keywords-list">
                            <li>
                                <a href="#">이용약관</a>
                            </li>
                            <li>
                                <a href="#">개인정보처리방침</a>
                            </li>
                            <li>
                                <a href="#">위치기반서비스 이용약관</a>
                            </li>
                        </ul>
                    </div>
                </div>`;
  initDetail(courseId); // Naver Map Api 이용하여 화면 생성하는 함수
}

function drawMap(locations) {
  var map = new naver.maps.Map("map", {
    center: new naver.maps.LatLng(locations[0].lat, locations[0].lng), // 배열의 첫 번째 위치를 중심으로 하는 지도
    zoom: 15,
  });

  for (var i = 0; i < locations.length; i++) {
    var marker = new naver.maps.Marker({
      title: locations[i].place,
      position: new naver.maps.LatLng(locations[i].lat, locations[i].lng),
      map: map,
    });
  }
  var polyline = new naver.maps.Polyline({
    path: locations, // 선 위치 변수배열
    strokeColor: "#FF0000", // 선 색깔
    strokeOpacity: 0.8, // 선 투명도 0 ~ 1
    strokeWeight: 6, // 선 두께
    map: map, // 오버레이할 지도
  });
}

function getLocations(courseData) {
  const locations = courseData.courseItems.map((store) => {
    return {
      place: store.name,
      lat: store.lat,
      lng: store.lng,
    };
  });

  drawMap(locations);
}

function loadImgBanner(courseData_data) {
  /* 코스 내 매장이 2개일 경우*/
  // 첫 번째 store-img 요소를 선택하고 내용을 변경
  var firstStoreImg = document.querySelector(
    ".img-banner-course .store-img:first-child"
  );
  if (courseData_data.courseItems[0].imageUrl == "") {
    firstStoreImg.innerHTML += `<img src = ../img/no-img.png>`;
  } else {
    firstStoreImg.innerHTML += `<img src = ${courseData_data.courseItems[0].imageUrl} >`;
  }

  // 두 번째 store-img 요소를 선택하고 내용을 변경
  var secondStoreImg = document.querySelector(
    ".img-banner-course .store-img:nth-child(2)"
  );
  if (courseData_data.courseItems[1].imageUrl == "") {
    secondStoreImg.innerHTML += `<img src = ../img/no-img.png>`;
  } else {
    secondStoreImg.innerHTML += `<img src = ${courseData_data.courseItems[1].imageUrl} >`;
  }

  /* 코스 내 매장이 3개 이상일 경우 */
  if (courseData_data.courseItems.length >= 3) {
    // 세 번째 store-img 요소를 선택하고 내용을 변경
    var thirdStoreImg = document.querySelector(
      ".img-banner-course .store-img:nth-child(3)"
    );

    if (courseData_data.courseItems[2].imageUrl == "") {
      thirdStoreImg.innerHTML += `<img src = ../img/no-img.png>`;
    } else {
      thirdStoreImg.innerHTML += `<img src = ${courseData_data.courseItems[2].imageUrl} >`;
    }
  } else if (courseData_data.courseItems.length == 2) {
    /* 2개일 땐 세 번째 img 칸 없애고 배치 조정*/
    var thirdStoreImg = document.querySelector(
      ".img-banner-course .store-img:nth-child(3)"
    );
    let parent = thirdStoreImg.parentElement;
    parent.removeChild(thirdStoreImg); // 부모로부터 myDiv 객체 제거
    parent.style.padding = "0 15% 0 20%";
    parent.style.margin = "0 0 0 0";
    parent.style.height = "470px";
    firstStoreImg.style.width = "45%";
    secondStoreImg.style.width = "45%";
    /* 반응형 - 화면이 모바일 사이즈일 경우 */
    var mql = window.matchMedia("screen and (max-width: 479px)");
    if (mql.matches) {
      parent.style.padding = "0 6%";
      parent.style.margin = "0 0 0 0";
      /* 배너 사진 크기 조정 */
      parent.style.height = "220px";
      firstStoreImg.style.width = "60%";
      secondStoreImg.style.width = "60%";
    }
  }
}

const regionArr = {
  KSS: "건대·성수·서울숲",
  HSE: "홍대·신촌·이대",
  SH: "상수·합정",
  HI: "한남·이태원",
  NS: "논현·신사",
  SBG: "서촌·북촌·광화문",
  EM: "을지로·명동",
};
let selectedRegion; // 코스 정보 디테일하게 보여주기 위함

function loadCourseContent(courseData_data) {
  // 유저가 프로필 이미지를 설정해놓지 않을 경우 기본 이미지로 설정
  let profileImage;
  if (courseData_data.memberProfileImage == null) {
    profileImage = "../img/userImg-removebg.svg";
  } else {
    profileImage = content.memberProfileImage;
  }

  const profileImgContainer = document.querySelector(".profile-img");
  const userNicknameContainer = document.querySelector(".user-nickname");
  const regionContainer = document.querySelector(".region");
  const courseNameContainer = document.querySelector(".course-name");
  const courseCatergoriesContainer =
    document.querySelector(".course-categories");
  const userNickname = courseData_data.nickname;
  const courseName = courseData_data.courseName;
  const cartegories = getCategories(courseData_data);

  profileImgContainer.innerHTML = `<img class="card-profile-img" src=${profileImage}>`;
  userNicknameContainer.innerText = userNickname;
  if (selectedRegion !== undefined) {
    regionContainer.innerText = regionArr[selectedRegion];
  } // 카드 아래 출력할 지역 정보 저장(ex. 홍대·신촌·이대)
  courseNameContainer.innerHTML = `<h2 class="card-title"> ${courseName}</h2 >`;
  courseCatergoriesContainer.innerText = cartegories;
}

// content 배열에서 모든 courseItems의 category 속성을 추출하여 배열 생성
function getCategories(courseData_data) {
  const categories = courseData_data.courseItems.map((store) => {
    const category = store.category.split(",")[0].trim();
    return category;
  });

  return categories; // 매장 정보 담긴 categories 반환
}

// Naver Map API 데이터를 보여주는 함수
function initDetail(courseId) {
  axios
    .get(`https://eodikase.com/v1/courses/course/${courseId}`)
    .then(function (response) {
      getLocations(response.data.data);
      loadImgBanner(response.data.data);
      loadCourseContent(response.data.data); // 성공시 피드 화면 만드는 함수 실행
    })
    .catch(function (error) {
      console.log("실패 courseId :", courseId);
    });
}

function calculateTime(createdDateFromCourse) {
  const createdDate = new Date(createdDateFromCourse);
  const currentDate = new Date(); // 현재 날짜 및 시간을 가져옴

  // 날짜 간의 일(day) 차이를 계산하는 함수
  function getDaysDiff(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // 1일에 해당하는 밀리초
    return Math.round(Math.abs((date1 - date2) / oneDay));
  }

  // 두 날짜 사이의 시간 차이를 계산
  const timeDiff = currentDate - createdDate;
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // 시간 차이 계산 (밀리초를 시간으로 변환)

  let str; // 시간 저장하는 반환 데이터

  if (hoursDiff < 1) {
    // 1시간 미만 경과 시, 몇 분 경과했는지 표시
    const minutesDiff = Math.floor(timeDiff / (1000 * 60)); // 분 차이 계산
    str = `${minutesDiff}분 전`;
  } else if (
    hoursDiff < 24 &&
    currentDate.getDate() === createdDate.getDate()
  ) {
    // 1시간 이상이지만 현재 날짜와 동일한 날에 생성된 경우, 시간 및 분(ex.13:50) 표시
    const formattedTime = `${createdDate.getHours()}:${createdDate.getMinutes()}`;

    str = `${formattedTime}`;
  } else {
    // 7일 이내인 경우, "n일 전" 형식으로 표시
    const daysDiff = getDaysDiff(currentDate, createdDate);
    if (daysDiff <= 7) {
      if (daysDiff === 1) {
        str = "어제";
      } else {
        str = `${daysDiff}일 전`;
      }
    } else {
      // 7일 이상 경과 시, 날짜 형식으로 표시 (예: 11/4)
      const formattedDate = `${
        createdDate.getMonth() + 1
      }/${createdDate.getDate()}`;
      str = formattedDate;
    }
  }
  return str;
}

init();
