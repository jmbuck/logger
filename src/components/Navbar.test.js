import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Navbar from "./Navbar";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("Navbar", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should render component", () => {
        const component = Enzyme.shallow(<Navbar />);

        expect(component).toMatchSnapshot();
    });
});

