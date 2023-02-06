import { Router } from "express";
import axios from "axios";

const sisiroute = Router();

sisiroute.get("/courses", (req, res) => {
	console.log("courses");
	const unitId = req.query.unitId;
	if (unitId == null) {
		res.send("unitId is null");
	}
	axios.post(`https://stud-api.num.edu.mn/topMenus/courses?unitid=${unitId}`).then((response) => {
		res.send(response.data);
	});
});

sisiroute.get("/teacher", (req, res) => {
	console.log("teacher");
	const unitId = req.query.unitId;
	if (unitId == null) {
		res.send("unitId is null");
	}
	axios.post(`https://stud-api.num.edu.mn/topMenus/EmpForSchedule?unitid=${unitId}`).then((response) => {
		res.send(response.data);
	});
});

sisiroute.get("/schedule", (req, res) => {
	const courseId = req.query.courseid;
	const teacherId = req.query.teacherid;
	if (courseId == null || teacherId == null) {
		res.send("unitId is null");
	}
	axios
		.post(`https://stud-api.num.edu.mn/topMenus/TopSchedules?courseid=${courseId}?empid=${teacherId}`)
		.then((response) => {
			res.send(response.data);
		});
});

export default sisiroute;
