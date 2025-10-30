-- Add hide_branding column to profiles table
-- This allows public profiles to check if branding should be hidden without querying pro_status

-- Add the column if it doesn't exist
alter table public.profiles 
add column if not exists hide_branding boolean default false;

-- Create a function to sync pro_status to profiles.hide_branding
create or replace function sync_hide_branding()
returns void
language plpgsql
security definer
as $$
begin
  -- Update all profiles based on their pro_status
  update public.profiles p
  set hide_branding = true
  from public.pro_status ps
  where p.email = ps.email 
  and ps.plan = 'pro';
  
  -- Set to false for profiles without pro status
  update public.profiles p
  set hide_branding = false
  where not exists (
    select 1 from public.pro_status ps 
    where ps.email = p.email 
    and ps.plan = 'pro'
  );
end;
$$;

-- Run the initial sync
select sync_hide_branding();

-- Create a trigger to automatically update hide_branding when pro_status changes
create or replace function public.handle_pro_status_change()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' or TG_OP = 'UPDATE' then
    -- Update profiles where email matches
    update public.profiles
    set hide_branding = (NEW.plan = 'pro')
    where email = NEW.email;
    return NEW;
  elsif TG_OP = 'DELETE' then
    -- Set hide_branding to false when pro_status is deleted
    update public.profiles
    set hide_branding = false
    where email = OLD.email;
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
