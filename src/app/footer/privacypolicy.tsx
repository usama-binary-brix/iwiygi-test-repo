import { FC } from "react";

const PrivacyPolicy: FC = () => {
  return (
    <div className="modal-content">
      <style jsx>{`
        .modal-content {
          border: 2px solid rgb(3 247 25);
          max-height: 80vh; /* Set maximum height for the modal content */
          overflow-y: auto; /* Enable vertical scroll if content exceeds max height */
          padding: 20px; /* Add padding */
          margin: 1rem; /* Add margin to create space from all sides */
          background-color: black; /* Background color */
          border-radius: 10px; /* Rounded corners */
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Box shadow for depth */
          margin-top: 50px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid lightgray;
          background: black;
          color: white;
        }
        th,
        td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
      `}</style>
      <>
        <div className="font-bold mb-1">
          &ldquo;I Want It . . .You Got It?&rdquo; Privacy Policy (updated November 1, 2023){" "}
        </div>
        <div>
          This policy details how data about you is used when you access our
          websites and services, including via our mobile applications
          (together, &quot;IWI&quot;) or interact with us. If we update it, we will revise
          the date, place notices on IWI if changes are material, and/or obtain
          your consent as required by law.
        </div>
        <div className="bg-dark-green text-black font-bold w-fit my-2">
          1. Protecting your Privacy
        </div>
        <li>
          We take precautions to prevent unauthorized access to or misuse of
          data about you.
        </li>
        <li>
          We do not share your data with third parties for marketing purposes.
        </li>
        <li>We do not engage in cross-marketing or link-referral programs.</li>
        <li>We do not employ tracking devices for marketing purposes.</li>
        <li>
          We do not send you unsolicited communications for marketing purposes.
        </li>
        <li>
          We do not engage in affiliate marketing (and prohibit it on IWI).
        </li>
        <li>
          Please review privacy policies of any third party sites linked to from
          IWI.
        </li>
        <li>
          We do not respond to &ldquo;Do Not Track&rdquo; signals (see{" "}
          <a href="https://allaboutdnt.com" target="_blank">
            allaboutdnt.com
          </a>
          ).
        </li>
        <div className="bg-dark-green text-black font-bold w-fit my-2">
          2. Data we collect, use and disclose:
        </div>
        Below is a list of all the types of data we have collected in the last
        12 months, where we got it, why we collected it and the categories of
        third parties to whom we disclosed it. We do not sell your data to third
        parties. Please note that disclosure to “Payment Processors” applies when you pay for an IWI listed item under the terms and conditions of the payment processor.
        <br />
        <br />
        <div className="w-full overflow-x-auto">
        <table>
          <tr className="">
            <th className="text-xs xl:text-lg lg:text-lg">Data type</th>
            <th className="text-xs  xl:text-lg lg:text-lg">Where we got it</th>
            <th className="text-xs  xl:text-lg lg:text-lg">Why collected</th>
            <th className="text-xs  xl:text-lg lg:text-lg">Disclosed to</th>
          </tr>
          <tr>
            <td className="text-sm">First and last name</td>
            <td className="text-sm">User entry</td>
            <td className="text-sm">Facilitating transactions and personalizing your use of IWI</td>
            <td className="text-sm">No One</td>
          </tr>
          <tr>
            <td className="text-sm">Email address</td>
            <td className="text-sm">User entry</td>
            <td className="text-sm">
              Account creation, user-to-user and IWI-to-user communications and
              combatting fraud/abuse
            </td>
            <td className="text-sm">No One</td>
          </tr>
          <tr>
            <td className="text-sm">Phone number</td>
            <td className="text-sm">User entry</td>
            <td className="text-sm">
              User-to-user communications, combatting fraud/abuse, personalizing
              your use of IWI
            </td>
            <td className="text-sm">No One</td>
          </tr>
          <tr>
            <td className="text-sm">Mailing or street address</td>
            <td className="text-sm">User entry</td>
            <td className="text-sm">
              Account and post creation, IWI communicating with corporate users,
              facilitating transactions and personalizing your use of IWI
            </td>
            <td className="text-sm">No One</td>
          </tr>
          <tr>
            <td className="text-sm">Geographic location (latitude and longitude)</td>
            <td className="text-sm">User entry, IP/geolocation providers</td>
            <td className="text-sm">Personalizing your use of IWI and combatting fraud/abuse</td>
            <td className="text-sm">No One</td>
          </tr>
          <tr>
            <td className="text-sm">
              Photos and other data you voluntarily provide, post on or send via
              IWI
            </td>
            <td className="text-sm">User entry</td>
            <td className="text-sm">Facilitating and personalizing your use of IWI</td>
            <td className="text-sm">No One</td>
          </tr>
          <tr>
            <td className="text-sm">
              Saved searches, account preferences, favorite/hidden postings
            </td>
            <td className="text-sm">User entry</td>
            <td className="text-sm">Facilitating and personalizing your use of IWI</td>
            <td className="text-sm">No One</td>
          </tr>
          <tr>
            <td className="text-sm">HTTP browser cookie</td>
            <td className="text-sm">User's browser, IWI web server</td>
            <td className="text-sm">
              Facilitating and personalizing your use of IWI and combatting
              fraud/abuse
            </td>
            <td className="text-sm">No One</td>
          </tr>
          <tr>
            <td className="text-sm">
              Information about your device and browser such as device ID,
              browser version, operating system, plugins
            </td >
            <td className="text-sm">User's browser, mobile app</td>
            <td className="text-sm">
              Facilitating and personalizing your use of IWI and combatting
              fraud/abuseI
            </td>
            <td className="text-sm">No One</td>
          </tr>
          <tr>
            <td className="text-sm">IP address</td>
            <td className="text-sm">User's browser, mobile app, IP/geolocation providers</td>
            <td className="text-sm">Combatting fraud/abuse</td>
            <td className="text-sm">Service providers that help us combat fraud/abuse</td>
          </tr>
          <tr>
            <td className="text-sm">Web page views, access times, HTTP headers</td>
            <td className="text-sm">User's browser, mobile app</td>
            <td className="text-sm">Combatting fraud/abuse</td>
            <td className="text-sm">No One</td>
          </tr>
        </table>
        </div>
       
        <br />
        We may share some or all of the above listed data in the following
        circumstances: <br />
        <li>
          to respond to subpoenas, search warrants, court orders, or other legal
          process.
        </li>
        <li>
          to protect the rights, property, or safety of IWI users, IWI, or the
          general public.
        </li>
        <li>
          at your direction (e.g. if you authorize us to share data with other
          users).
        </li>
        <li>
          in connection with a merger, bankruptcy, or sale/transfer of assets.
        </li>
        <div className="bg-dark-green text-black font-bold w-fit my-2">
          3. Data we store
        </div>
        <li>
          We retain data as needed to facilitate and personalize your use of
          IWI, combat fraud/abuse and/or as required by law.
        </li>
        <li>
          We make good faith efforts to store data securely, but can make no
          guarantees.
        </li>
        <li>
          You may access and update certain data about you via your account
          login.
        </li>
        <div className="bg-dark-green text-black font-bold w-fit my-2">
          International Users
        </div>
        By accessing IWI or providing us data, you agree we may use and disclose
        data we collect as described here or as communicated to you, transmit it
        outside your resident jurisdiction, and store it on servers in the
        United States. <br />
        For more information please contact our privacy officer at
        contact@iwantityougotit.com.
        <div className="bg-dark-green text-black font-bold w-fit my-2">
          Contact
        </div>
        If you have any questions or concerns about IWI's privacy policy and
        practices please email contact@iwantityougotit.com
        <br />
        By USPS / Mail to: <br />
        <b>I Want It, LLC </b>
        <br />
        9101 W Sahara Ave
        <br />
        Suite 105, #1074
        <br />
        Las Vegas, NV 89117
        <br />
      </>
    </div>
  );
};

export default PrivacyPolicy;
