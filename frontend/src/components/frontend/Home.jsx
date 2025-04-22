// Trang Home khi người dùng chưa đăng nhập

import React from "react";

export const Home = () => {
  return (
    <>
      <main>
        <section className="section-1">
          <div className="hero d-flex align-items-center">
            <div className="container-fluid">
              <div className="text-center">
                <span>Chào mừng ...</span>
                <h1>
                  <span>R</span>ivercrane Training
                </h1>
                <p>
                  Trang quản lý người dùng, sản phẩm Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Quisquam, voluptatibus. Lorem
                  ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                  voluptatibus.
                </p>
                <div>
                  <a className="btn btn-primary" href="/login">
                    Đăng nhập
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
