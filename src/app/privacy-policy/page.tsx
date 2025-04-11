'use client'
import React, { useEffect } from "react";

const Page = () => {
    useEffect(()=>{
      window.scrollTo(0,0)
  
},[])
  return (
    <div className="p-3">
      <div className="bg-black border-2 border-bright-green p-2 lg:p-8">
        <div className="text-center text-2xl lg:text-4xl text-[30px] font-bold  tracking-wider mb-4 uppercase">
          - Privacy Policy -
        </div>
        <div className="font-bold mb-1">
          &ldquo;I Want It . . .You Got It?&rdquo; Privacy Policy (updated
          January 1, 2025){" "}
        </div>
        <div>
          This policy details how data about you is used when you access our
          websites and services, including via our mobile applications
          (together, &quot;IWI&quot;) or interact with us. If we update it, we
          will revise the date, place notices on IWI if changes are material,
          and/or obtain your consent as required by law.
        </div>
        <div className="bg-dark-green text-black font-bold w-fit my-2 p-1 rounded">
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
        <div className="bg-dark-green text-black font-bold w-fit my-2 p-1 rounded">
          2. Data we collect, use and disclose:
        </div>
        Below is a list of all the types of data we have collected in the last
        12 months, where we got it, why we collected it and the categories of
        third parties to whom we disclosed it. We do not sell your data to third
        parties. Please note that disclosure to “Payment Processors” applies
        when you pay for an IWI listed item under the terms and conditions of
        the payment processor.
        <br />
        <br />
        <div className="w-full overflow-x-auto">
          <table className="table border border-bright-green">
            <thead>
              <tr>
                <th className="text-xs text-start xl:text-lg lg:text-lg border border-bright-green p-1">
                  Data type
                </th>
                <th className="text-xs text-start xl:text-lg lg:text-lg border border-bright-green p-1">
                  Where we got it
                </th>
                <th className="text-xs text-start xl:text-lg lg:text-lg border border-bright-green p-1">
                  Why collected
                </th>
                <th className="text-xs text-start xl:text-lg lg:text-lg border border-bright-green p-1">
                  Disclosed to
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  First and last name
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User entry
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Facilitating transactions and personalizing your use of IWI
                </td>
                <td className="text-sm border border-bright-green p-1">No One</td>
              </tr>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  Email address
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User entry
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Account creation, user-to-user and IWI-to-user communications
                  and combatting fraud/abuse
                </td>
                <td className="text-sm border border-bright-green p-1">No One</td>
              </tr>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  Phone number
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User entry
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User-to-user communications, combatting fraud/abuse,
                  personalizing your use of IWI
                </td>
                <td className="text-sm border border-bright-green p-1">No One</td>
              </tr>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  Mailing or street address
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User entry
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Account and post creation, IWI communicating with corporate
                  users, facilitating transactions and personalizing your use of
                  IWI
                </td>
                <td className="text-sm border border-bright-green p-1">No One</td>
              </tr>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  Geographic location (latitude and longitude)
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User entry, IP/geolocation providers
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Personalizing your use of IWI and combatting fraud/abuse
                </td>
                <td className="text-sm border border-bright-green p-1">No One</td>
              </tr>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  Photos and other data you voluntarily provide, post on or send
                  via IWI
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User entry
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Facilitating and personalizing your use of IWI
                </td>
                <td className="text-sm border border-bright-green p-1">No One</td>
              </tr>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  Saved searches, account preferences, favorite/hidden postings
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User entry
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Facilitating and personalizing your use of IWI
                </td>
                <td className="text-sm border border-bright-green p-1">No One</td>
              </tr>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  HTTP browser cookie
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User's browser, IWI web server
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Facilitating and personalizing your use of IWI and combatting
                  fraud/abuse
                </td>
                <td className="text-sm border border-bright-green p-1">No One</td>
              </tr>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  Information about your device and browser such as device ID,
                  browser version, operating system, plugins
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User's browser, mobile app
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Facilitating and personalizing your use of IWI and combatting
                  fraud/abuse
                </td>
                <td className="text-sm border border-bright-green p-1">No One</td>
              </tr>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  IP address
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User's browser, mobile app, IP/geolocation providers
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Combatting fraud/abuse
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Service providers that help us combat fraud/abuse
                </td>
              </tr>
              <tr>
                <td className="text-sm border border-bright-green p-1">
                  Web page views, access times, HTTP headers
                </td>
                <td className="text-sm border border-bright-green p-1">
                  User's browser, mobile app
                </td>
                <td className="text-sm border border-bright-green p-1">
                  Combatting fraud/abuse
                </td>
                <td className="text-sm border border-bright-green p-1">No One</td>
              </tr>
            </tbody>
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
        <div className="bg-dark-green text-black font-bold w-fit my-2 p-1 rounded">
          3. Data we store
        </div>
        <li>
          Your data is stored securely in the United States with our data
          providers.
        </li>
        <li>
          You can delete your account and associated data at any time by
          contacting us.
        </li>
        <li>
          We retain your data only as long as necessary for business, legal, or
          compliance purposes.
        </li>
        <br />
        <div className="text-center font-bold text-lg mb-4">
          <span className="text-black">End of Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

export default Page;
