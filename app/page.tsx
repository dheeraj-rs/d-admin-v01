import IsolatedContainer from '@/core/layouts/IsolatedContainer'
import Layout from '@/core/layouts/Layout'

function Home() {
  return (
    <Layout>
      <IsolatedContainer>
        <h1>Home</h1>
        <div className="fixed bottom-0 right-0 bg-red-500 w-20 h-20">hai</div>
      </IsolatedContainer>
    </Layout>
  )
}

export default Home