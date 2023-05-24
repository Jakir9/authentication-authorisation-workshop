import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
)

export default function App() {
  const [session, setSession] = useState(null)

  async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    })
  }

  async function signout() {
    const { error } = await supabase.auth.signOut()
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Writing
  //let { data, error } = await supabase.from('leaderboard').insert({ name: 'Bob', score: 99999 })

  const updateScore = async () => {
    await supabase.from('leaderboard').insert({ name: 'chris', score: 99999 })
    console.log('updated')
  }

  // Reading
  // let { data, error } = await supabase
  //   .from('leaderboard')
  //   .select('name, score')
  //   .order('score', { ascending: false })

  const readLeaderboard = async () => {
    let { data, error } = await supabase.from('leaderboard').select('*')

    //let table = await supabase.from('leaderboard')

    // if (!error) {
    //   console.log(table)
    // } else {
    //   console.log(error)
    // }

    console.log({ data, error })
  }

  if (!session) {
    // if user is not logged in, show the Auth UI
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
  } else {
    // logged in displays when user is logged in
    return (
      <>
        <h3>Logged in!</h3>

        <button onClick={() => signout()}>Sign out</button>

        <button onClick={() => updateScore()}>write to leaderboard</button>

        <button onClick={() => readLeaderboard()}>read leaderboard</button>
      </>
    )
  }
}
