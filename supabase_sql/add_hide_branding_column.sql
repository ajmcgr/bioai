-- Add hide_branding column to profiles table
-- This allows public profiles to check if branding should be hidden without querying pro_status

-- Add the column if it doesn't exist
alter table public.profiles 
add column if not exists hide_branding boolean default false;

-- Create a function to sync pro_status to profiles.hide_branding using auth.users(email)
create or replace function public.sync_hide_branding()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  -- Mark PRO users' profiles to hide branding
  update public.profiles p
  set hide_branding = true
  from public.pro_status ps
  join auth.users u on u.email = ps.email
  where ps.plan = 'pro'
    and p.user_id = u.id;

  -- Set to false for profiles without pro status
  update public.profiles p
  set hide_branding = false
  where not exists (
    select 1
    from public.pro_status ps
    join auth.users u on u.email = ps.email
    where ps.plan = 'pro'
      and p.user_id = u.id
  );
end;
$$;

-- Run the initial sync
select public.sync_hide_branding();

-- Create a trigger to automatically update hide_branding when pro_status changes
create or replace function public.handle_pro_status_change()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if TG_OP = 'INSERT' or TG_OP = 'UPDATE' then
    -- Update profiles where auth.users.email matches NEW.email
    update public.profiles p
    set hide_branding = (NEW.plan = 'pro')
    from auth.users u
    where u.email = NEW.email
      and p.user_id = u.id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    -- Set hide_branding to false when pro_status is deleted
    update public.profiles p
    set hide_branding = false
    from auth.users u
    where u.email = OLD.email
      and p.user_id = u.id;
    return OLD;
  end if;
  return null;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_pro_status_change on public.pro_status;
create trigger on_pro_status_change
  after insert or update or delete on public.pro_status
  for each row execute function public.handle_pro_status_change();
