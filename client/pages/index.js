import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {

  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            <a className="nav-link">View</a>
          </Link>
        </td>
      </tr>
    );
  })

  return (
    <div>
      <h2>Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  );
};

/*
in nextjs, getInitialProps is our opportunity to attempt fetch
some data that the component needs during the server side rendering process. 
think of it like the use useEffect hook in reactjs or componentDidMount
*/
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
