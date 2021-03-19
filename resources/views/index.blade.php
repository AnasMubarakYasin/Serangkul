<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Home</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="{{asset('css/bootstrap/bootstrap.min.css')}}">
  <link rel="stylesheet" href="{{asset('fonts/icons/bootstrap-icons.css')}}">
  <link rel="stylesheet" href="{{asset('css/index.css')}}">
  <script defer type="module" src="{{asset('js/index.js')}}"></script>
</head>

<body>

  <!-- Navigasi -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">

    <div class="container-fluid">

      <a class="navbar-brand fs-1 fw-bolder " href="#" style="font-family: Edwardian Script ITC; color: rgb(192 80 77);">Serangkul.id</a>


      <div class="container">
        <form class="d-flex" style="font-family: Bell MT">
          <input class="form-control me-2  rounded-pill border border-danger w-50" aria-describedby="inputGroup-sizing-sm" type="search" placeholder="Search" aria-label="Search">

          <button class="btn btn-danger rounded-pill" type="submit"><span class="fa fa-search"></span></button>
        </form>
      </div>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse fs-5" id="navbarSupportedContent" style="font-family: Bell MT;">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Galang&nbsp;Dana</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Komunitas</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Tentang</a>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Akun
              <!-- <i class="fa fa-user-circle-o fa-lg" ></i>           -->
            </a>

            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#one">Profile</a></li>
              <li><a class="dropdown-item" href="#two">Setting</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="#three">Login</a></li>
            </ul>
          </li>

        </ul>

      </div>
    </div>
  </nav>

  <!-- Slider -->
  <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
      <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="{{ asset('images/Slider/1.PNG') }}" class="d-block w-100" alt="...">
      </div>
      <div class="carousel-item">
        <img src="{{ asset('images/Slider/2.PNG') }}" class="d-block w-100" alt="...">
      </div>
      <div class="carousel-item">
        <img src="{{ asset('images/Slider/3.PNG') }}" class="d-block w-100" alt="...">
      </div>
      <div class="carousel-item">
        <img src="{{ asset('images/Slider/4.PNG') }}" class="d-block w-100" alt="...">
      </div>
      <div class="carousel-item">
        <img src="{{ asset('images/Slider/5.PNG') }}" class="d-block w-100" alt="...">
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>

  <!-- Desc singkat -->
  <div class="text-center p-3 fs-5 " style=" font-family: Bell MT;">
    <div class="card-header fs-2" style=" font-family: Bell MT; ">
      Apa Itu <strong style=" color: #c4544c;">Serangkul.id?</strong>
    </div>
    <div class="card-body shadow-sm" style="background-color: #fafafa;">
      <center><strong style=" color: #c4544c;">Serangkul.id</strong></center>
      <p class="card-text p-3">Merupakan sebuah platform galang dana yang mewadahi individu dan komunitas kemanusiaan yang ada di makassar untuk bersama-sama <span style="color: #c4544c;">#SalingRangkul</span> saudara kita yang Membutuhkan Donasi. Komunitas dapat Membuat sebuah produk (Merchandise) untuk tambahan dana dalam proses pengalangan dana konten yg dimiliki dan kemudian di tawarkan kepada user. </p>
      <a href="#" class="btn btn-outline-danger">Baca Selengkapnya</a>
    </div>

  </div><br>

  <!-- <div class="container">
    <div class="row row-cols-md-3 ms-5" style=" padding: 20px; margin-left: 20px;">
      <div class="col">
        <button style="border-radius: 300px; background-color: white; border-color: #c4544c;"><img
            src="images/ikon/dona.png" class="card-img-top" alt="..."
            style="width: 140px; height: 140px; padding: 20px; border-radius: 20px;"></button>
        <div class="card-body" style="margin-left: 20px;">
          <h5 class="card-title">Donasi</h5>
        </div>
      </div>
      <div class="col">
        <button style="border-radius: 300px; background-color: white; border-color: #c4544c;"><img
            src="images/ikon/prod.png" class="card-img-top" alt="..."
            style="width: 140px; height: 140px; padding: 20px; border-radius: 20px;"></button>
        <div class="card-body" style="margin-left: 20px;">
          <h5 class="card-title">Produk</h5>
        </div>
      </div>
      <div class="col">
        <button style="border-radius: 300px; background-color: white; border-color: #c4544c;"><img
            src="images/ikon/kis.png" class="card-img-top" alt="..."
            style="width: 140px; height: 140px; padding: 20px; border-radius: 20px;"></button>
        <div class="card-body" style="margin-left: 34px;">
          <h5 class="card-title">Kisah</h5>
        </div>
      </div>
    </div>
  </div> -->


  <!-- TIGA ikon  -->
  <div class="container-fluid  p-5">
    <div class="row gy-2 m-0 row-cols-auto   ">
      <div class="col col-sm-4 px-5 ms-auto me-auto  w-auto h-auto d-inline-block ">
        <div class="rounded-circle rounded-3 border shadow  bg-light m-auto d-flex category ">
          <img src="{{ asset('images/ikon/prod.png') }}" class="img-circle align-center m-auto w-50 h-auto p-3 h1" alt="...">
        </div>
        <h2 class="h4 text-center my-3">Donasi</h2>
      </div>
      <div class="col col-sm-4 px-5 ms-auto me-auto  w-auto h-auto d-inline-block">
        <div class="rounded-circle rounded-3 border shadow bg-light m-auto d-flex category">
          <img src="{{ asset('images/ikon/prod.png') }}" class="img-circle align-center m-auto w-50 h-auto p-3 h1" alt="...">
        </div>
        <h2 class="h4 text-center my-3">Produk</h2>
      </div>
      <div class="col col-sm-4 px-5 ms-auto me-auto  w-auto h-auto d-inline-block">
        <div class="rounded-circle rounded-3 border shadow bg-light m-auto d-flex category">
          <img src="{{ asset('images/ikon/prod.png') }}" class="img-circle align-center m-auto w-50 h-auto p-3 h1" alt="...">
        </div>
        <h2 class="h4 text-center my-3">Cerita</h2>
      </div>

    </div>
  </div> <br>


  <!-- Galang Dana Mendesak -->
  <div class="text-center fs-2" style=" font-family: Bell MT; ">
    <strong style=" color: #c4544c;">Penggalangan Dana Mendesak</strong>
    <center>
      <hr size="10px" width="50%">
    </center><br>
  </div>

  <div class="container-fluid px-5">
    <div class="scroll-container" style="overflow-x: scroll;">
      <div class="gridscroll" style="display:inline-block; ">

        <div class="row ">

          <div class="col" style="width: 2000px;">
            <div class="card h-100">
              <img src="{{asset('images/Slider/4.PNG')}}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">Title</h5>
                <div class="progress">
                  <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div> <br>
                <span>Dana Terkumpul</span><br>
                <span><strong>Rp.00.000</strong></span>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card h-100">
              <img src="{{asset('images/Slider/5.PNG')}}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">Title</h5>
                <div class="progress">
                  <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 25%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div> <br>
                <span>Dana Terkumpul</span><br>
                <span><strong>Rp.00.000</strong></span>
              </div>
            </div>
          </div>


          <div class="col">
            <div class="card h-100">
              <img src="{{asset('images/Slider/3.PNG')}}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">Title</h5>
                <div class="progress">
                  <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div> <br>
                <span>Dana Terkumpul</span><br>
                <span><strong>Rp.00.000</strong></span>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="card h-100">
              <img src="{{asset('images/Slider/1.PNG')}}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">Title</h5>
                <div class="progress">
                  <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 75%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div> <br>
                <span>Dana Terkumpul</span><br>
                <span><strong>Rp.00.000</strong></span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <div class="d-grid gap-2 d-md-flex justify-content-md-end p-5">
    <a href="#" class="btn btn-danger">Lihat Semua</a>
  </div>

  <br><br>

  <!-- Rekomendasi Produk Merchandise -->
  <div class="text-center fs-2" style=" font-family: Bell MT; ">
    <strong style=" color: #c4544c;">REKOMENDASI PRODUK</strong>
    <center>
      <hr size="10px" width="50%">
    </center>
  </div>
  <div class="container-fluid p-5">
    <div class="row row-cols-1 row-cols-md-2 g-4 justify-content-evenly">

      <div class="col" style="width: 450px;">
        <div class="card">
          <img src="{{asset('images/Slider/1.PNG')}}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Card Title</h5>
            <span><strong style="color: #c4544c">Rp.00.000</strong></span> <br>

            <div class="d-grid gap-2 d-md-flex justify-content-between">
              <span>Terjual : 9</span>
              <ul class="list-inline">
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item "><i class="fa fa-star"></i></li>
                <li class="list-inline-item"><i class="fa fa-star"></i></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="col" style="width: 450px;">
        <div class="card">
          <img src="{{asset('images/Slider/2.PNG')}}" class="card-img-top" alt="...">
          <div class="card-body ">
            <h5 class="card-title">Card Title</h5>
            <span><strong style="color: #c4544c">Rp.00.000</strong></span> <br>

            <div class="d-grid gap-2 d-md-flex justify-content-between">
              <span>Terjual : 9</span>
              <ul class="list-inline">
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item "><i class="fa fa-star"></i></li>
                <li class="list-inline-item"><i class="fa fa-star"></i></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <div class="col" style="width: 450px;">
        <div class="card">
          <img src="{{asset('images/Slider/3.PNG')}}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Card Title</h5>
            <span><strong style="color: #c4544c">Rp.00.000</strong></span> <br>

            <div class="d-grid gap-2 d-md-flex justify-content-between">
              <span>Terjual : 9</span>
              <ul class="list-inline">
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item "><i class="fa fa-star"></i></li>
                <li class="list-inline-item"><i class="fa fa-star"></i></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="col" style="width: 450px;">
        <div class="card">
          <img src="{{asset('images/Slider/4.PNG')}}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Card Title</h5>
            <span><strong style="color: #c4544c">Rp.00.000</strong></span> <br>

            <div class="d-grid gap-2 d-md-flex justify-content-between">
              <span>Terjual : 9</span>
              <ul class="list-inline">
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item selected"><i class="fa fa-star"></i></li>
                <li class="list-inline-item "><i class="fa fa-star"></i></li>
                <li class="list-inline-item"><i class="fa fa-star"></i></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center">
    <a href="#" class="btn btn-danger">Lihat Semua</a>
  </div>

  <br><br><br>
  <div class="container comp-category my-4">
    <div class="row m-0 g-4">
      <div class="col">
        <h1 class="fs-3">
          Pilih kategori favorite
        </h1>
      </div>
    </div>
    <div class="row m-0 g-4 category-list">
      <div class="col-3 col-sm-3">
        <div class="rounded-circle rounded-3 border bg-secondary m-auto d-flex category">
          <i class="bi-image align-center m-auto h1"></i>
        </div>
        <h2 class="fs-5 text-center my-3">category</h2>
      </div>
      <div class="col-3 col-sm-3">
        <div class="rounded-circle rounded-3 border bg-secondary m-auto d-flex category">
          <i class="bi-image align-center m-auto h1"></i>
        </div>
        <h2 class="fs-5 text-center my-3">category</h2>
      </div>
      <div class="col-3 col-sm-3">
        <div class="rounded-circle rounded-3 border bg-secondary m-auto d-flex category">
          <i class="bi-image align-center m-auto h1"></i>
        </div>
        <h2 class="fs-5 text-center my-3">category</h2>
      </div>
      <div class="col-3 col-sm-3">
        <div class="rounded-circle rounded-3 border bg-secondary m-auto d-flex category">
          <i class="bi-image align-center m-auto h1"></i>
        </div>
        <h2 class="fs-5 text-center my-3">category</h2>
      </div>
    </div>
  </div>
  <footer class="container-fluid">
    <div class="row bg-gray p-5 pb-0">
      <div class="col-12 col-md-4 d-grid justify-items-center">
        <h1 class="fs-5">Tentang Kami</h1>
        <p class="fs-6">Description</p>
      </div>
      <div class="col-12 col-md-4 d-grid justify-items-center">
        <h1 class="fs-5">Another Link</h1>
        <ul>
          <li>item</li>
          <li>item</li>
          <li>item</li>
        </ul>
      </div>
      <div class="col-12 col-md-4 d-grid justify-items-center">
        <h1 class="fs-5">Connect Us</h1>
        <div class="row py-2 px-4 g-2">
          <div class="col-3"><i class="bi-twitter fs-5"></i></div>
          <div class="col-3"><i class="bi-twitter fs-5"></i></div>
          <div class="col-3"><i class="bi-twitter fs-5"></i></div>
          <div class="col-3"><i class="bi-twitter fs-5"></i></div>
        </div>
      </div>
    </div>
    <div class="row pt-3 pb-2 bg-secondary text-white">
      <div class="col-12">
        <p class="fs-6 text-center">Copyright &copy; 2021 Resaurce. All Right Reserved</p>
      </div>
    </div>
  </footer>
  <!-- Optional JavaScript; choose one of the two! -->

  <!-- Option 1: Bootstrap Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous">
  </script>

  <!-- Option 2: Separate Popper and Bootstrap JS -->
  <!--
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.6.0/dist/umd/popper.min.js" integrity="sha384-KsvD1yqQ1/1+IA7gi3P0tyJcT3vR+NdBTt13hSJ2lnve8agRGXTTyNaBYmCR/Nwi" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.min.js" integrity="sha384-nsg8ua9HAw1y0W1btsyWgBklPnCUAFLuTMS2G72MMONqmOymq585AcH49TLBQObG" crossorigin="anonymous"></script>
    -->
</body>

</html>