// URL에서 검색어를 추출
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const keyword = urlParams.get("keyword");

// 검색어를 처리하고 표시
if (keyword) {
  performSearch(keyword);
} else {
  printEmptySearch();
}

// 빈칸 검색시 예외 처리
function printEmptySearch() {
  const search_feed = document.querySelector(".search-feed");
  search_feed.innerHTML = `
        <p style="height: 100px; display: flex; justify-content: center; align-items: center;"> 
            아무것도 입력하지 않았습니다. <br> 다른 검색어를 입력해보세요. 
            </p>`;
}

// 검색어 keyword 정보 요청 함수
function performSearch(keyword) {
  // 요청을 보낼 URL 설정
  const apiUrl = `https://eodikase.com/v1/courses/title/search?keyword=${keyword}`;

  axios
    .get(apiUrl)
    .then((response) => {
      loadSearchFeedContent(response.data.data.content);
    })
    .catch((error) => {
      console.error("검색 오류:", error);
    });
}

// Search 피드 화면 만드는 함수
function loadSearchFeedContent(courseData) {
  const search_feed = document.querySelector(".search-feed");

  if (courseData.length === 0) {
    search_feed.innerHTML = `
        <p style="height: 400px; display: flex; justify-content: center; align-items: center;"> 
            결과를 조회할 수 없습니다. <br> 다른 검색어를 입력해보세요.
            </p>`;
  } else {
    courseData.forEach((content) => {
      // 유저가 프로필 이미지를 설정해놓지 않을 경우 기본 이미지로 설정
      let profileImage;
      if (content.memberProfileImage == null) {
        // 사용자 이미지 미설정
        profileImage = "../img/userImg-removebg.svg";
      } else {
        // 이미지 설정
        profileImage = content.memberProfileImage.imgUrl;
      }

      const courseId = content.courseId;
      const nickname = content.nickname;

      const createdTime = calculateTime(content.createdDate);
      const courseName = content.courseName;
      const courseDescription = content.courseDescription;

      const imageUrl = content.courseItems[0].imageUrl; // 이후 배열 처리

      search_feed.innerHTML += `
                    <a href="#" onclick="detail(${courseId});" style="text-decoration-line: none">
                    <div class="card">
                        <div>
                            <img class="card-profile-img" src=${profileImage}>
                            <div class="card-user-nickname" style="margin:0 0 10px 0;"><div class="user-name" style="padding: 0 0 0 0">${nickname}</div>
                                <p class="card-time" style="padding:0 0 0 0; margin:1px 0 20px 0;corlor:gray"><small class="text-muted">${createdTime}</small>
                                    </p>
                            </div>
                        </div>
                        <h5 class="card-title" style="margin:0;">${courseName}</h5>
                        <p class="card-desc">${courseDescription}</p>
                        <img src= ${imageUrl} class="card-img-bottom">
                    </div> 
                    <hr style="color:gray;">
                    </a>
                    
                    `;
    });
  }
}

function detail(courseId) {
  // contailner 비우고 html로 직접 채우기
  const container = document.querySelector(".container");
  const search_section = document.querySelector(".search-section");

  search_section.innerHTML = "";
  search_section.style.height = "0px";
  container.innerHTML = "";
  container.innerHTML += `
        <div class="header">
                <div class="navbar">
                    <ul class="navbar-ul" style="width: 100%; height: 65px; display: flex; flex-direction: row; justify-content: space-evenly; align-items: center; margin: 0">
                        <li><a href="../html/index.html"> <img class="logo-img" src="../img/app-logo.png" style="width: auto; height: auto"></a></li>
                        <li><a href="../html/index.html" style="text-decoration: none; color:#551A8B; font-family: Pretendard, 'Noto Sans KR', sans-serif">
                            <h5 style="margin: 0; font-weight: 650; ">어디카세</h5></a></li>
                        <li><a href="../html/course.html" style="text-decoration: none; color:#551A8B; font-family: Pretendard, 'Noto Sans KR', sans-serif"> <h5 style="margin: 0; font-weight: 650; ">코스 둘러보기</h5> </a></li>
                        <li class="search">
                            <form action="../html/search.html" method="get">
                                <input class="search-input" type="search" name="keyword" placeholder="코스를 검색해보세요">
                            </form>
                        </li>
                    </ul>
                </div>
                <hr>
                <div class="back" onclick="goBack()">
                      <i class="fa-solid fa-arrow-left fa-2x"></i>
                </div>
                <div class="img-banner-search">
                    <div class="store-img"></div>
                    <div class="store-img"></div>
                    <div class="store-img"></div>
                </div>
            </div>
            <div class="course-detail-search">
                <div class="user-info">
                    <div class="profile-img"></div>
                    <div class="user-info-right-side">
                        <div class="user-nickname"></div>
                        <div class="region"></div>
                    </div>
                </div>
                <div class="course-info">
                    <div class="course-name"></div>
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
  initDetail(courseId);
}

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
    strokeColor: "#FF0000", //선 색깔
    strokeOpacity: 0.8, // 선 투명도 0 ~ 1
    strokeWeight: 6, // 선 두께
    map: map, // 오버레이할 지도
  });
}

function loadImgBanner(courseData_data) {
  // 첫 번째 store-img 요소를 선택하고 내용을 변경
  var firstStoreImg = document.querySelector(
    ".img-banner-search .store-img:first-child"
  );
  if (courseData_data.courseItems[0].imageUrl == "") {
    firstStoreImg.innerHTML += `<img src = ../img/no-img.png>`; //임의
  } else {
    firstStoreImg.innerHTML += `<img src = ${courseData_data.courseItems[0].imageUrl} >`;
  }

  // 두 번째 store-img 요소를 선택하고 내용을 변경
  var secondStoreImg = document.querySelector(
    ".img-banner-search .store-img:nth-child(2)"
  );
  if (courseData_data.courseItems[1].imageUrl == "") {
    secondStoreImg.innerHTML += `<img src = ../img/no-img.png>`; //임의
  } else {
    secondStoreImg.innerHTML += `<img src = ${courseData_data.courseItems[1].imageUrl} >`;
  }

  // 세 번째 store-img 요소를 선택하고 내용을 변경
  var thirdStoreImg = document.querySelector(
    ".img-banner-search .store-img:nth-child(3)"
  );

  if (courseData_data.courseItems[2].imageUrl == "") {
    thirdStoreImg.innerHTML += `<img src = ../img/no-img.png>`; //임의
  } else {
    thirdStoreImg.innerHTML += `<img src = ${courseData_data.courseItems[2].imageUrl} >`;
  }
}

function loadCourseContent(courseData_data) {
  // 유저가 프로필 이미지를 설정해놓지 않을 경우 기본 이미지로 설정
  let profileImage;
  // 이미지 미설정
  if (courseData_data.memberProfileImage == null) {
    profileImage = "../img/userImg-removebg.svg";
  } else {
    // 이미지 설정한 경우
    profileImage = courseData_data.memberProfileImage.imgUrl;
  }

  const profileImgContainer = document.querySelector(".profile-img");
  const userNicknameContainer = document.querySelector(".user-nickname");
  const courseNameContainer = document.querySelector(".course-name");
  const courseCatergoriesContainer =
    document.querySelector(".course-categories");
  const userNickname = courseData_data.nickname;
  const courseName = courseData_data.courseName;
  const cartegories = getCategories(courseData_data);

  profileImgContainer.innerHTML = `<img class="card-profile-img" src=${profileImage}>`;
  userNicknameContainer.innerText = userNickname;
  courseNameContainer.innerHTML = `<h2 class="card-title"> ${courseName}</h2 >`;
  courseCatergoriesContainer.innerText = cartegories;
}
// content 배열에서 모든 courseItems의 category 속성을 추출하여 배열 만들기
function getCategories(courseData_data) {
  const categories = courseData_data.courseItems.map((store) => {
    const category = store.category.split(",")[0].trim();
    return category;
  });

  return categories; // 매장 정보 담긴 categories 반환
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

// 뒤로가기
function goBack() {
  history.back();
  location.reload(true);
}
