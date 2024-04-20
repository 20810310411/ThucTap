
require('rootpath')()
module.exports = {
    getQLHD: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        let ten = sessions.ten

        console.log(sessions);
        console.log(taikhoan);
        console.log(loggedIn);

        res.render("ADMINQL/QuanLy/QL_HoaDon/homeQLHD.ejs", { logIn: loggedIn, taikhoan, rootPath: '/' })
    },


}