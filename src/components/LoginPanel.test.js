import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LoginPanel from "./LoginPanel";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("LoginPanel", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should render component", () => {
        //const component = Enzyme.shallow(<LoginPanel />);

        expect(component).toMatchSnapshot();
    });
});

