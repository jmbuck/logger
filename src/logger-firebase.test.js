import "./database/Auth";
import * as database from "./database/Database";
import {msToString, retrieveFirebaseUserYoutubeVideoData} from "./logger-firebase";

jest.mock("./database/Database");

describe("Logger Firebase Integration", () => {

	describe("msToString", () => {
		it("should parse milliseconds to seconds", () => {
			expect(msToString(1000)).toBe("1 second");
			expect(msToString(1500)).toBe("1 second");
			expect(msToString(54786)).toBe("54 seconds");
		});

		it("should parse milliseconds to minutes", () => {
			expect(msToString(1000 * 60)).toBe("1 minute");
			expect(msToString(1000 * 60 + 233)).toBe("1 minute");
			expect(msToString(23000 * 60 + 988)).toBe("23 minutes");
		});

		it("should parse milliseconds to hours", () => {
			expect(msToString(1000 * 60 * 60)).toBe("1 hour");
			expect(msToString(1000 * 60 * 60 + 234)).toBe("1 hour");
			expect(msToString(23000 * 60 * 60 + 989)).toBe("23 hours");
		});

		it("should parse milliseconds to days", () => {
			expect(msToString(1000 * 60 * 60 * 24)).toBe("1 day");
			expect(msToString(1000 * 60 * 60 * 24 + 204)).toBe("1 day");
			expect(msToString(23000 * 60 * 60 * 24 + 970)).toBe("23 days");
		});

		it("should parse milliseconds", () => {
			expect(msToString(1000 * (1 + 60 + 60 * 60 + 60 * 60 * 24))).toBe("1 day, 1 hour, 1 minute, 1 second");
			expect(msToString(1000 * (3 + 60 +  4 * 60 * 60 * 24))).toBe("4 days, 1 minute, 3 seconds");
		});
	});

	describe("retrieveFirebaseUserYoutubeVideoData", () => {

		const mock = jest.fn();

		retrieveFirebaseUserYoutubeVideoData(mock.mock.calls.length).toBe(1);



	})
});

